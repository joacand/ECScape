using ECScape.Components;
using ECScape.Engine;
using ECScape.Entities;

namespace ECScape.Systems;

internal sealed class DamageSystem : ISystem
{
    public static DateTime LastDamage { get; set; } = DateTime.Now;
    public static DateTime LastCollectable { get; set; } = DateTime.Now;

    public static DateTime GameStart { get; set; } = DateTime.Now;
    public static TimeSpan GameStartSafeState { get; set; } = TimeSpan.FromSeconds(3);

    public DamageSystem()
    {
        GameStart = DateTime.Now;
        LastDamage = DateTime.Now;
        LastCollectable = DateTime.Now;
    }

    public void Update(World world, float _)
    {
        if (DateTime.Now - GameStart < GameStartSafeState)
        {
            return; // Skip updates during the initial safe state
        }

        Parallel.ForEach(world.Entities
            .Where(x => x.HasComponent<DamagesPlayer>() && x.HasComponent<Position>()), entity => Update(entity, world));

        Parallel.ForEach(world.Entities
            .Where(x => x.HasComponent<Collectable>() && x.HasComponent<Position>()), entity => UpdateCollectibles(entity, world));
    }

    public static void Update(Entity entity, World world)
    {
        var position = entity.GetRequiredComponent<Position>();
        var size = entity.GetComponent<Size>() ?? new Size(1, 1);
        var damageComponent = entity.GetRequiredComponent<DamagesPlayer>();

        var player = world.GetEntityWith(typeof(PlayerControllable), typeof(Position));
        if (player == null) { return; }

        var playerPosition = player.GetRequiredComponent<Position>();
        var playerSize = player.GetComponent<Size>() ?? new Size(1, 1);

        if (IsColliding(position, size, playerPosition, playerSize))
        {
            if (DateTime.Now - LastDamage < damageComponent.DamageInterval)
            {
                return;
            }
            LastDamage = DateTime.Now;
            var damage = damageComponent.DamageAmount;
            playerSize.Width -= damage;
            playerSize.Height -= damage;
        }
    }

    private static void UpdateCollectibles(Entity entity, World world)
    {
        var position = entity.GetRequiredComponent<Position>();
        var collectableComponent = entity.GetRequiredComponent<Collectable>();
        var size = entity.GetComponent<Size>() ?? new Size(1, 1);

        var player = world.GetEntityWith(typeof(PlayerControllable), typeof(Position));
        if (player == null) { return; }

        var playerPosition = player.GetRequiredComponent<Position>();
        var playerSize = player.GetComponent<Size>() ?? new Size(1, 1);

        if (IsColliding(position, size, playerPosition, playerSize))
        {
            if (DateTime.Now - LastCollectable < collectableComponent.CollectInterval)
            {
                return;
            }
            LastCollectable = DateTime.Now;
            size.Width -= 1;
            size.Height -= 1;
        }
    }

    private static bool IsColliding(Position position, Size size, Position position2, Size size2)
    {
        return position.LeftInt < position2.LeftInt + size2.Width &&
               position.LeftInt + size.Width > position2.LeftInt &&
               position.TopInt < position2.TopInt + size2.Height &&
               position.TopInt + size.Height > position2.TopInt;
    }
}

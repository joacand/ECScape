using ECScape.Core.Components;
using ECScape.Core.Engine;
using ECScape.Core.Entities;

namespace ECScape.Core.Systems;

internal sealed class DamageSystem : ISystem
{
    public void Update(World world, float _)
    {
        Parallel.ForEach(world.Entities
            .Where(x => x.HasComponent<DamagesPlayer>() && x.HasComponent<Position>() && x.HasComponent<Exists>()), entity => Update(entity, world));

        Parallel.ForEach(world.Entities
            .Where(x => x.HasComponent<Collectable>() && x.HasComponent<Position>() && x.HasComponent<Exists>()), entity => UpdateCollectibles(entity, world));

        Parallel.ForEach(world.Entities
            .Where(x => x.HasComponent<PowerUpHealth>() && x.HasComponent<Position>() && x.HasComponent<Exists>()), entity => UpdatePowerUps(entity, world));
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
        var invulerable = player.GetComponent<Invulnerable>();

        if (IsColliding(position, size, playerPosition, playerSize) && IsVulnerable(invulerable))
        {
            var playerHealth = player.GetRequiredComponent<Health>();
            playerHealth.Hearts -= damageComponent.DamageAmount;
            player.AddComponent(new Invulnerable
            {
                ExpirationTime = DateTime.Now.AddSeconds(damageComponent.DamageInterval.TotalSeconds)
            });
            var damage = damageComponent.DamageAmount;
            playerSize.Width -= damage;
            playerSize.Height -= damage;
            if (playerSize.Width <= 0) { playerSize.Width = 1; }
            if (playerSize.Height <= 0) { playerSize.Height = 1; }
        }
    }

    private static void UpdateCollectibles(Entity entity, World world)
    {
        var position = entity.GetRequiredComponent<Position>();
        var collectableComponent = entity.GetRequiredComponent<Collectable>();
        var size = entity.GetComponent<Size>() ?? new Size(1, 1);
        var invulerable = entity.GetComponent<Invulnerable>();

        var player = world.GetEntityWith(typeof(PlayerControllable), typeof(Position));
        if (player == null) { return; }

        var playerPosition = player.GetRequiredComponent<Position>();
        var playerSize = player.GetComponent<Size>() ?? new Size(1, 1);

        if (IsColliding(position, size, playerPosition, playerSize) && IsVulnerable(invulerable))
        {
            var health = entity.GetRequiredComponent<Health>();
            entity.AddComponent(new Invulnerable
            {
                ExpirationTime = DateTime.Now.AddSeconds(collectableComponent.CollectInterval.TotalSeconds)
            });
            health.Hearts -= 1;
            size.Width -= 1;
            size.Height -= 1;
            if (size.Width <= 0) { size.Width = 1; }
            if (size.Height <= 0) { size.Height = 1; }
            if (health.Hearts <= 0)
            {
                entity.RemoveComponent<Exists>();
            }
            var statistics = player.GetRequiredComponent<Statistics>();
            statistics.Score += collectableComponent.ScoreAmount;
        }
    }

    private void UpdatePowerUps(Entity entity, World world)
    {
        var position = entity.GetRequiredComponent<Position>();
        var powerUpComponent = entity.GetRequiredComponent<PowerUpHealth>();
        var size = entity.GetComponent<Size>() ?? new Size(1, 1);
        var invulerable = entity.GetComponent<Invulnerable>();

        var player = world.GetEntityWith(typeof(PlayerControllable), typeof(Position));
        if (player == null) { return; }

        var playerPosition = player.GetRequiredComponent<Position>();
        var playerSize = player.GetComponent<Size>() ?? new Size(1, 1);

        if (IsColliding(position, size, playerPosition, playerSize))
        {
            var playerHealth = player.GetRequiredComponent<Health>();
            playerHealth.Hearts += 1;
            playerSize.Width += 1;
            playerSize.Height += 1;
            entity.RemoveComponent<Exists>();
            var statistics = player.GetRequiredComponent<Statistics>();
            statistics.Score += 1;
        }
    }

    private static bool IsColliding(Position position, Size size, Position position2, Size size2)
    {
        return position.LeftInt < position2.LeftInt + size2.Width &&
               position.LeftInt + size.Width > position2.LeftInt &&
               position.TopInt < position2.TopInt + size2.Height &&
               position.TopInt + size.Height > position2.TopInt;
    }

    private static bool IsVulnerable(Invulnerable? invulerable)
    {
        return invulerable == null || DateTime.Now > invulerable.ExpirationTime;
    }
}

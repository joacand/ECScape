using ECScape.Core.Components;
using ECScape.Core.Engine;
using ECScape.Core.Entities;

namespace ECScape.Core.Systems;

internal class SpawnerSystem : ISystem
{
    private DateTime LastMeteroid = DateTime.Now;
    private DateTime LastPowerUp = DateTime.Now;
    private DateTime LastMeteroidRoll = DateTime.Now;
    private DateTime LastPowerUpRoll = DateTime.Now;
    private static readonly TimeSpan MinTimeBetween = TimeSpan.FromSeconds(4);
    private static readonly TimeSpan TimeBetweenRolls = TimeSpan.FromSeconds(1);

    public void Update(World world, float _)
    {
        SpawnCollectables(world);
        SpawnMeteroid(world);
        SpawnPowerUp(world);
    }

    private void SpawnMeteroid(World world)
    {
        if (DateTime.Now - LastMeteroid < MinTimeBetween) { return; }
        if (DateTime.Now - LastMeteroidRoll < TimeBetweenRolls) { return; }
        LastMeteroidRoll = DateTime.Now;
        if (World.Random.Next(0, 10) < 2) { return; }
        EntityFactory.CreateMeteoroid(world, World.Random.Next(0, UiInterface.WorldWidth + 1), 1, 1);
        LastMeteroid = DateTime.Now;
    }

    private void SpawnPowerUp(World world)
    {
        if (DateTime.Now - LastPowerUp < MinTimeBetween) { return; }
        if (DateTime.Now - LastPowerUpRoll < TimeBetweenRolls) { return; }
        LastPowerUpRoll = DateTime.Now;
        if (World.Random.Next(0, 10) < 3) { return; }
        EntityFactory.CreatePowerUp(world, World.Random.Next(0, UiInterface.WorldWidth + 1), 1, 1);
        LastPowerUp = DateTime.Now;
    }

    private static void SpawnCollectables(World world)
    {
        var collectables = world.GetEntitiesWith(typeof(Collectable), typeof(Exists));
        if (collectables.Count() >= 2) { return; }

        var width = World.Random.Next(1, 5);
        var height = World.Random.Next(1, 5);
        EntityFactory.CreateCollectable(
            world,
            World.Random.Next(0, UiInterface.WorldWidth + 1),
            World.Random.Next(0, UiInterface.WorldHeight + 1),
            World.Random.Next(0, 2) == 0 ? '$' : '♥',
            width,
            height,
            Math.Min(width, height));
    }
}

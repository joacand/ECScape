using ECScape.Core.Components;
using ECScape.Core.Engine;
using ECScape.Core.Entities;

namespace ECScape.Core.Systems;

internal class SpawnerSystem : ISystem
{
    public void Update(World world, float _)
    {
        var spawners = world.GetEntitiesWith(typeof(Spawner));
        foreach (var spawner in spawners.Where(x => !x.HasComponent<Exists>()))
        {
            Spawn(spawner);
        }
    }

    private static void Spawn(Entity spawner)
    {
        var spawnerComponent = spawner.GetRequiredComponent<Spawner>();
        if (DateTime.Now - spawnerComponent.LastSpawn < spawnerComponent.MinTimeBetweenSpawns) { return; }
        if (DateTime.Now - spawnerComponent.LastRoll < spawnerComponent.TimeBetweenRolls) { return; }
        spawnerComponent.LastRoll = DateTime.Now;
        if (World.Random.NextDouble() < spawnerComponent.SpawnChance) { return; }

        var position = spawner.GetRequiredComponent<Position>();
        position.Left = World.Random.Next(0, UiInterface.WorldWidth + 1);
        position.Top = 1;

        if (spawnerComponent.RandomSizeHealth)
        {
            var size = spawner.GetRequiredComponent<Size>();
            var width = World.Random.Next(1, 5);
            var height = World.Random.Next(1, 5);
            size.Width = width;
            size.Height = height;

            var health = spawner.GetComponent<Health>();
            if (health != null)
            {
                health.Hearts = Math.Min(width, height);
            }
        }
        spawner.AddComponent(new Exists());

        spawnerComponent.LastSpawn = DateTime.Now;
    }
}

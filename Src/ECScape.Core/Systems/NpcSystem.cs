using ECScape.Core.Components;
using ECScape.Core.Engine;
using ECScape.Core.Entities;
using System.Collections.Concurrent;

namespace ECScape.Core.Systems;

internal sealed class NpcSystem : ISystem
{
    private readonly ConcurrentDictionary<Entity, DateTime> lastUpdateTimes = new();
    private static readonly TimeSpan updateInterval = TimeSpan.FromMilliseconds(500);

    public void Update(World world, float deltaTime)
    {
        Parallel.ForEach(world.Entities
            .Where(x => x.HasComponent<Npc>() && x.HasComponent<Velocity>()), Update);
    }

    private void Update(Entity entity)
    {
        if (!lastUpdateTimes.TryGetValue(entity, out DateTime lastUpdate))
        {
            lastUpdate = DateTime.MinValue;
            lastUpdateTimes[entity] = lastUpdate;
        }

        if (DateTime.Now - lastUpdate < updateInterval)
        {
            return;
        }
        var velocity = entity.GetRequiredComponent<Velocity>();

        lastUpdateTimes[entity] = DateTime.Now;
        var horizontal = World.Random.Next(-200, 200);
        var vertical = World.Random.Next(-10, 200);
        vertical = Math.Abs(vertical) < 2 ? 0 : vertical;

        velocity.Y = vertical;
        velocity.X = horizontal;
    }
}

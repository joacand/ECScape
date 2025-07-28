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
            .Where(x => x.HasComponent<Npc>() && x.HasComponent<Velocity>() && x.HasComponent<Position>()), x => Update(world, x));
    }

    private void Update(World world, Entity entity)
    {
        if (!lastUpdateTimes.TryGetValue(entity, out DateTime lastUpdate))
        {
            lastUpdate = DateTime.MinValue;
            lastUpdateTimes[entity] = lastUpdate;
        }

        if (DateTime.Now - lastUpdate < updateInterval) { return; }
        var playerPosition = world.GetEntityWith(typeof(PlayerControllable))?.GetComponent<Position>();
        var velocity = entity.GetRequiredComponent<Velocity>();
        var position = entity.GetRequiredComponent<Position>();

        // Bias to move towards the player
        var left = -200;
        var right = 200;
        var distanceToPlayer = Math.Clamp((playerPosition != null ? playerPosition.Left - position.Left : 0) / 40, -1.0, 1.0);
        var bias = distanceToPlayer * 50.0;
        left += (int)bias;
        right += (int)bias;

        lastUpdateTimes[entity] = DateTime.Now;
        var horizontal = World.Random.Next(left, right);
        var vertical = World.Random.Next(-10, 200);
        vertical = Math.Abs(vertical) < 2 ? 0 : vertical;

        velocity.Y = vertical;
        velocity.X = horizontal;
    }
}

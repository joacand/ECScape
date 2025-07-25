using ECScape.Core.Components;
using ECScape.Core.Engine;
using ECScape.Core.Entities;

namespace ECScape.Core.Systems;

internal class SpawnerSystem : ISystem
{
    public void Update(World world, float _)
    {
        SpawnCollectables(world);
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

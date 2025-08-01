using ECScape.Core.Entities;

namespace ECScape.Core.Engine;

public static class Seeder
{
    public static void Seed(World world)
    {
        EntityFactory.CreatePlayer(world, 0, 0);

        EntityFactory.CreateEnemy(world, 30, 0, 'X', 3, 2);
        EntityFactory.CreateEnemy(world, 30, 0, '%', 3, 1);
        EntityFactory.CreateEnemy(world, 10, 0, '#', 2, 1);

        EntityFactory.CreateGroundBlock(world, 0, UiInterface.WorldBottom - 2, UiInterface.WorldWidth, 3);
        EntityFactory.CreateCloudBlock(world, 20, 15, 3, 3);

        EntityFactory.CreateCollectable(
            world,
            World.Random.Next(0, UiInterface.WorldWidth + 1),
            World.Random.Next(0, UiInterface.WorldHeight + 1),
            World.Random.Next(0, 2) == 0 ? '$' : '♥',
            1,
            1,
            1,
            true);
        EntityFactory.CreateCollectable(
            world,
            World.Random.Next(0, UiInterface.WorldWidth + 1),
            World.Random.Next(0, UiInterface.WorldHeight + 1),
            World.Random.Next(0, 2) == 0 ? '$' : '♥',
            1,
            1,
            1,
            true);

        EntityFactory.CreateMeteoroid(
            world,
            World.Random.Next(0, UiInterface.WorldWidth + 1),
            1,
            1,
            true);

        EntityFactory.CreatePowerUp(
            world,
            World.Random.Next(0, UiInterface.WorldWidth + 1),
            1,
            1,
            true);
    }
}

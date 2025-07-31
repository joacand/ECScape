using ECScape.Core.Entities;

namespace ECScape.Core.Engine;

internal static class Seeder
{
    public static void Seed(World world)
    {
        EntityFactory.CreatePlayer(world, 0, 0);

        EntityFactory.CreateEnemy(world, 30, 0, 'X', 3, 2);
        EntityFactory.CreateEnemy(world, 30, 0, '%', 3, 1);
        EntityFactory.CreateEnemy(world, 10, 0, '#', 2, 1);

        EntityFactory.CreateGroundBlock(world, 0, UiInterface.WorldBottom - 2, UiInterface.WorldWidth, 3);
        EntityFactory.CreateCloudBlock(world, 20, 15, 3, 3);
    }
}

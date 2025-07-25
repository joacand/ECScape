using ECScape.Entities;

namespace ECScape.Engine;

internal static class Seeder
{
    public static void Seed(World world)
    {
        EntityFactory.CreatePlayer(world, 0, 0);

        EntityFactory.CreateEnemy(world, 30, 0, 'X', 3, 2);
        EntityFactory.CreateEnemy(world, 30, 0, '%', 3, 1);
        EntityFactory.CreateEnemy(world, 10, 0, '#', 2, 1);

        EntityFactory.CreateCollectable(world, 25, 10, '$', 3, 4);
        EntityFactory.CreateCollectable(world, 50, 10, '♥', 2, 2);

        // Ground blocks
        for (var i = 0; i < 3; i++)
        {
            for (var j = 0; j < UiInterface.WorldWidth; j++)
            {
                EntityFactory.CreateGroundBlock(world, j, UiInterface.WorldBottom - i);
            }
        }

        // Cloud blocks
        for (var i = 0; i < 3; i++)
        {
            for (var j = 0; j < 3; j++)
            {
                EntityFactory.CreateCloudBlock(world, 20 - j, 20 - i);
            }
        }
    }
}

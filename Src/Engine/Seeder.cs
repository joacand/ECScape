using ECScape.Components;
using ECScape.Entities;

namespace ECScape.Engine;

internal static class Seeder
{
    private static int idCounter = 0;

    public static void Seed(World world)
    {
        CreateEntity(world, [
                new AffectedByGravity(),
                new LimitedByBounds(),
                new Position(0, 0),
                new IsDrawable { Symbol = '#', Color = ConsoleColor.Green },
                new Size(2,2),
                new Velocity(),
                new IsPlayerControllable(),
            ]);
        CreateEntity(world, [
                new AffectedByGravity(),
                new LimitedByBounds(),
                new Position(30, 0),
                new Npc(),
                new IsDrawable { Symbol = '@', Color = ConsoleColor.Blue },
                new Size(3,2),
                new Velocity(),
            ]);
        CreateEntity(world, [
                new AffectedByGravity(),
                new LimitedByBounds(),
                new Position(10, 0),
                new Npc(),
                new IsDrawable { Symbol = '%', Color = ConsoleColor.Blue },
                new Size(2,1),
                new Velocity(),
            ]);

        // Create ground
        for (var g = 0; g < 3; g++)
        {
            for (var i = 0; i < Console.WindowWidth; i++)
            {
                CreateEntity(world, [
                    new Position(i, Console.WindowHeight-1-g),
                    new IsDrawable { Symbol = '=',  Color = ConsoleColor.Gray },
                    new Size(1,1),
                    new LimitedByBounds(),
                    new Solid(),
            ]);
            }
        }

        // Create block in cloud
        for (var g = 0; g < 3; g++)
        {
            for (var i = 0; i < 3; i++)
            {
                CreateEntity(world, [
                    new Position(20-i, 20-g),
                    new IsDrawable { Symbol = '=', Color = ConsoleColor.Magenta },
                    new Size(1,1),
                    new LimitedByBounds(),
                    new Solid(),
            ]);
            }
        }
    }

    private static void CreateEntity(World world, List<IComponent> components)
    {
        var id = idCounter++;
        var entity = new Entity(id, components);
        world.Entities.Add(entity);
    }
}

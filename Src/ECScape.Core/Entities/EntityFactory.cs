using ECScape.Core.Components;
using ECScape.Core.Engine;

namespace ECScape.Core.Entities;

public static class EntityFactory
{
    private static int idCounter = 0;

    public static Entity CreatePlayer(World world, double left, double top)
    {
        return Create(world, [
            new Exists(),
            new Health(),
            new AffectedByGravity(),
            new LimitedByBounds(),
            new Position(left, top),
            new Drawable { Symbol = '☻', Color = ConsoleColor.Green },
            new Size(3, 3),
            new Velocity(),
            new PlayerControllable(),
            new Statistics(),
            new Invulnerable
            {
                ExpirationTime = DateTime.Now.AddSeconds(3)
            },
        ]);
    }

    public static Entity CreateEnemy(World world, double left, double top, char symbol, int width, int height)
    {
        return Create(world, [
            new Exists(),
            new AffectedByGravity(),
            new LimitedByBounds(),
            new Position(left, top),
            new Npc(),
            new Drawable { Symbol = symbol, Color = ConsoleColor.Red },
            new Size(width, height),
            new Velocity(),
            new DamagesPlayer { DamageAmount = 1 }
        ]);
    }

    public static Entity CreateMeteoroid(World world, double left, int width, int height, bool spawner)
    {
        var entity = Create(world, [
            new AffectedByGravity(),
            new Position(left, UiInterface.WorldTop),
            new Drawable { Symbol = '★', Color = ConsoleColor.DarkRed },
            new Size(width, height),
            new Velocity(){ X = World.Random.Next(-2,2), Y = 5 },
            new DamagesPlayer { DamageAmount = 1 }
        ]);

        if (spawner)
        {
            entity.AddComponent(new Spawner { LastSpawn = DateTime.Now, RandomSizeHealth = false });
        }
        else
        {
            entity.AddComponent(new Exists());
        }

        return entity;
    }

    public static Entity CreatePowerUp(World world, double left, int width, int height, bool spawner)
    {
        var entity = Create(world, [
            new AffectedByGravity() { Gravity = 3 },
            new PowerUpHealth(),
            new Position(left, UiInterface.WorldTop),
            new Drawable { Symbol = '+', Color = ConsoleColor.Cyan },
            new Size(width, height),
            new Velocity() { X = World.Random.Next(-2,2), Y = 0 }
        ]);

        if (spawner)
        {
            entity.AddComponent(new Spawner { LastSpawn = DateTime.Now, RandomSizeHealth = false });
        }
        else
        {
            entity.AddComponent(new Exists());
        }

        return entity;
    }

    public static Entity CreateCollectable(World world, double left, double top, char symbol, int width, int height, int hearts, bool spawner)
    {
        var entity = Create(world, [
            new Health { Hearts = hearts },
            new AffectedByGravity(),
            new LimitedByBounds(),
            new Position(left, top),
            new Npc(),
            new Drawable { Symbol = symbol, Color = ConsoleColor.Yellow },
            new Size(width, height),
            new Velocity(),
            new Collectable(),
            new Invulnerable
            {
                ExpirationTime = DateTime.Now.AddSeconds(3)
            },
        ]);

        if (spawner)
        {
            entity.AddComponent(new Spawner());
        }
        else
        {
            entity.AddComponent(new Exists());
        }

        return entity;
    }

    public static Entity CreateGroundBlock(World world, int left, int top, int width, int height)
    {
        return Create(world, [
            new Exists(),
            new Position(left, top),
            new Drawable { Symbol = '=', Color = ConsoleColor.Gray },
            new Size(width, height),
            new LimitedByBounds(),
            new Solid()
        ]);
    }

    public static Entity CreateCloudBlock(World world, int left, int top, int width, int height)
    {
        return Create(world, [
            new Exists(),
            new Position(left, top),
            new Drawable { Symbol = '=', Color = ConsoleColor.Magenta },
            new Size(width, height),
            new LimitedByBounds(),
            new Solid()
        ]);
    }

    private static Entity Create(World world, List<IComponent> components)
    {
        var id = idCounter++;
        var entity = new Entity(id, components);
        world.Entities.Add(entity);
        return entity;
    }
}
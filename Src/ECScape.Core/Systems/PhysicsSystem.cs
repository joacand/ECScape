using ECScape.Core.Components;
using ECScape.Core.Engine;
using ECScape.Core.Entities;

namespace ECScape.Core.Systems;

internal sealed class PhysicsSystem : ISystem
{
    public void Update(World world, float deltaTime)
    {
        Parallel.ForEach(world.Entities
            .Where(x => x.HasComponent<Position>() && x.HasComponent<AffectedByGravity>()), entity => Update(entity, world, deltaTime));
    }

    public static void Update(Entity entity, World world, float deltaTime)
    {
        var gravity = entity.GetRequiredComponent<AffectedByGravity>().Gravity;
        var position = entity.GetRequiredComponent<Position>();
        var size = entity.GetComponent<Size>() ?? new Size(1, 1);

        var originalPosition = new Position(position.Left, position.Top);

        position.Top += gravity * deltaTime;

        if (entity.HasComponent<Velocity>())
        {
            HandleVelocity(entity.GetRequiredComponent<Velocity>(), position, deltaTime);
        }

        if (entity.HasComponent<LimitedByBounds>())
        {
            LimitBounds(position, size);
            LimitBySolidEntities(world, size, position, originalPosition);
        }
    }

    private static void LimitBounds(Position position, Size size)
    {
        if (position.Left < 0)
        {
            position.Left = 0;
        }
        if (position.Left + size.Width >= UiInterface.WorldWidth)
        {
            position.Left = UiInterface.WorldWidth - size.Width;
        }
        if (position.Top < UiInterface.WorldTop)
        {
            position.Top = UiInterface.WorldTop;
        }
        if (position.Top + size.Height >= UiInterface.WorldBottom)
        {
            position.Top = UiInterface.WorldBottom;
        }
    }

    private static void HandleVelocity(Velocity velocity, Position position, float deltaTime)
    {
        position.Top -= velocity.Y * deltaTime;
        position.Left += velocity.X * deltaTime;

        velocity.X *= 1.0f - deltaTime * Configuration.MovementDecayRate;
        velocity.Y *= 1.0f - deltaTime * Configuration.MovementDecayRate;

        // Zero out very small values to prevent jitter
        if (Math.Abs(velocity.X) < 0.1) velocity.X = 0;
        if (Math.Abs(velocity.Y) < 0.1) velocity.Y = 0;
    }

    private static void LimitBySolidEntities(World world, Size size, Position position, Position originalPosition)
    {
        if (IsBlocked(position, size, world.GetEntitiesWith(typeof(Position), typeof(Solid))))
        {
            position.Top = originalPosition.Top;
            if (IsBlocked(position, size, world.GetEntitiesWith(typeof(Position), typeof(Solid))))
            {
                position.Left = originalPosition.Left;
            }
        }
    }

    private static bool IsBlocked(Position position, Size size, IEnumerable<Entity> solidPositions)
    {
        return solidPositions.Any(s =>
            s.GetRequiredComponent<Position>().LeftInt < position.LeftInt + size.Width &&
            s.GetRequiredComponent<Position>().LeftInt + s.GetRequiredComponent<Size>().Width > position.LeftInt &&
            s.GetRequiredComponent<Position>().TopInt < position.TopInt + size.Height &&
            s.GetRequiredComponent<Position>().TopInt + s.GetRequiredComponent<Size>().Height > position.TopInt);
    }
}

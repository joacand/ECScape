using ECScape.Core.Components;
using ECScape.Core.Engine;
using ECScape.Core.Entities;
using System.Runtime.InteropServices;

namespace ECScape.Terminal.Systems;

internal sealed partial class InputSystem : Core.Systems.InputSystem
{
    [LibraryImport("user32.dll")]
    internal static partial short GetAsyncKeyState(int vKey);

    private static bool IsKeyDown(ConsoleKey key)
    {
        return (GetAsyncKeyState((int)key) & 0x8000) != 0;
    }

    public override void Update(World world, float deltaTime)
    {
        Parallel.ForEach(world.Entities
            .Where(x => x.HasComponent<PlayerControllable>() && x.HasComponent<Velocity>()), Update);
    }

    private void Update(Entity entity)
    {
        HandlePlayerInput(entity.GetRequiredComponent<Velocity>());
    }

    private static void HandlePlayerInput(Velocity velocity)
    {
        if (IsKeyDown(ConsoleKey.W))
        {
            velocity.Y = Configuration.PlayerMovementVertical;
        }
        if (IsKeyDown(ConsoleKey.A))
        {
            velocity.X = -Configuration.PlayerMovementHorizontal;
        }
        if (IsKeyDown(ConsoleKey.D))
        {
            velocity.X = Configuration.PlayerMovementHorizontal;
        }
    }
}

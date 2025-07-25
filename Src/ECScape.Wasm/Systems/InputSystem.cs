using ECScape.Components;
using ECScape.Engine;
using ECScape.Systems;

namespace ECScape.Wasm.Systems;

public sealed class InputSystem : ISystem
{
    private readonly HashSet<string> keysDown = [];

    public void RegisterKeyDown(string key)
    {
        keysDown.Add(key.ToLower());
    }

    public void RegisterKeyUp(string key)
    {
        keysDown.Remove(key.ToLower());
    }

    public void Update(World world, float deltaTime)
    {
        foreach (var entity in world.Entities
                     .Where(e => e.HasComponent<PlayerControllable>() && e.HasComponent<Velocity>()))
        {
            var velocity = entity.GetRequiredComponent<Velocity>();
            HandleInput(velocity);
        }
    }

    private void HandleInput(Velocity velocity)
    {
        if (keysDown.Contains("w") || keysDown.Contains("arrowup"))
        {
            velocity.Y = Configuration.PlayerMovementVertical;
        }
        if (keysDown.Contains("a") || keysDown.Contains("arrowleft"))
        {
            velocity.X = -Configuration.PlayerMovementHorizontal;
        }
        if (keysDown.Contains("d") || keysDown.Contains("arrowright"))
        {
            velocity.X = Configuration.PlayerMovementHorizontal;
        }
    }
}

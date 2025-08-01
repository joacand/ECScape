using ECScape.Core.Components;
using ECScape.Core.Engine;

namespace ECScape.Blazor;

public class InputSystem : Core.Systems.InputSystem
{
    public bool LeftPressed { get;private set; }
    public bool RightPressed { get; private set; }
    public bool JumpPressed { get; private set; }

    public void SetLeft(bool pressed) => LeftPressed = pressed;
    public void SetRight(bool pressed) => RightPressed = pressed;
    public void SetJump(bool pressed) => JumpPressed = pressed;

    public override void Update(World world, float deltaTime)
    {
        var player = world.GetEntityWith(typeof(PlayerControllable), typeof(Velocity));
        if (player == null) return;

        var velocity = player.GetRequiredComponent<Velocity>();

        if (LeftPressed)
        {
            velocity.X = -Configuration.PlayerMovementHorizontal;
        }
        if (RightPressed)
        {
            velocity.X = Configuration.PlayerMovementHorizontal;
        }
        if (JumpPressed)
        {
            velocity.Y = Configuration.PlayerMovementVertical;
        }
    }
}

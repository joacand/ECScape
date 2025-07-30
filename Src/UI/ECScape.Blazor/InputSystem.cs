using ECScape.Core.Components;
using ECScape.Core.Engine;
using Microsoft.JSInterop;

namespace ECScape.Blazor;

public class InputSystem : Core.Systems.InputSystem
{
    public bool LeftPressed { get; set; }
    public bool RightPressed { get; set; }
    public bool JumpPressed { get; set; }

    public void SetLeft(bool pressed) => LeftPressed = pressed;
    public void SetRight(bool pressed) => RightPressed = pressed;
    public void SetJump(bool pressed) => JumpPressed = pressed;

    //[JSInvokable]
    //public void OnKeyDown(string key)
    //{
    //    switch (key)
    //    {
    //        case "ArrowLeft":
    //            LeftPressed = true;
    //            break;
    //        case "ArrowRight":
    //            RightPressed = true;
    //            break;
    //        case "ArrowUp":
    //        case " ":
    //            JumpPressed = true;
    //            break;
    //    }
    //}

    //[JSInvokable]
    //public void OnKeyUp(string key)
    //{
    //    switch (key)
    //    {
    //        case "ArrowLeft":
    //            LeftPressed = false;
    //            break;
    //        case "ArrowRight":
    //            RightPressed = false;
    //            break;
    //        case "ArrowUp":
    //        case " ":
    //            JumpPressed = false;
    //            break;
    //    }
    //}

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

        // Reset inputs for next frame
        LeftPressed = RightPressed = JumpPressed = false;
    }
}

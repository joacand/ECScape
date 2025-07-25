using ECScape.Wasm.Systems;
using Microsoft.JSInterop;

namespace ECScape.Wasm;

public static class InputInterop
{
    public static InputSystem InputSystem { get; set; } = new();

    [JSInvokable("OnKeyDown")]
    public static void OnKeyDown(string key)
    {
        InputSystem?.RegisterKeyDown(key);
    }

    [JSInvokable("OnKeyUp")]
    public static void OnKeyUp(string key)
    {
        InputSystem?.RegisterKeyUp(key);
    }
}

using ECScape.Core;
using ECScape.Core.Components;
using Microsoft.JSInterop;

namespace ECScape.Blazor;

public sealed class CanvasRenderer(IJSRuntime jsRuntime, int width, int height) : IOutputRenderer
{
    private readonly IJSRuntime _jsRuntime = jsRuntime;
    private readonly int _width = width;
    private readonly int _height = height;

    public async Task Initialize(string canvasId)
    {
        await _jsRuntime.InvokeVoidAsync("initialize", canvasId, _width, _height);
    }

    public void Clear()
    {
        _ = _jsRuntime.InvokeVoidAsync("clear");
    }

    public void Write(char character, ConsoleColor color, Position position)
    {
        var colorStr = color switch
        {
            ConsoleColor.Black => "#000000",
            ConsoleColor.Blue => "#0000FF",
            ConsoleColor.Cyan => "#00FFFF",
            ConsoleColor.Gray => "#808080",
            ConsoleColor.Green => "#00FF00",
            ConsoleColor.Magenta => "#FF00FF",
            ConsoleColor.Red => "#FF0000",
            ConsoleColor.White => "#FFFFFF",
            ConsoleColor.Yellow => "#FFFF00",
            _ => "#FFFFFF"
        };

        _ = _jsRuntime.InvokeVoidAsync("drawCharacter", position.LeftInt, position.TopInt, character.ToString(), colorStr);
    }
}
using ECScape.Core;
using ECScape.Core.Components;
using Microsoft.JSInterop;

namespace ECScape.Blazor;

public class CanvasRenderer : IOutputRenderer, IDisposable
{
    private readonly IJSRuntime _jsRuntime;
    private readonly int _width;
    private readonly int _height;
    private DotNetObjectReference<CanvasRenderer>? _dotNetRef;

    public CanvasRenderer(IJSRuntime jsRuntime, int width, int height)
    {
        _jsRuntime = jsRuntime;
        _width = width;
        _height = height;
        _dotNetRef = DotNetObjectReference.Create(this);
    }

    public async Task Initialize(string canvasId)
    {
        await _jsRuntime.InvokeVoidAsync("initialize",
            _dotNetRef, canvasId, _width, _height);
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

        _ = _jsRuntime.InvokeVoidAsync("drawCharacter",
            position.LeftInt, position.TopInt, character.ToString(), colorStr);
    }

    public void Dispose()
    {
        _dotNetRef?.Dispose();
    }
}
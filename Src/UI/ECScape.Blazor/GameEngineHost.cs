using ECScape.Core.Engine;
using Microsoft.JSInterop;

namespace ECScape.Blazor;

public class GameEngineHost
{
    private CanvasRenderer Renderer { get; }
    private InputSystem InputSystem { get; }
    private Game Game { get; set; }

    public GameEngineHost(IJSRuntime jsRuntime, InputSystem inputSystem)
    {
        InputSystem = inputSystem;
        UiInterface.SetBounds(120, 30);
        Renderer = new CanvasRenderer(jsRuntime, UiInterface.TotalWidth, UiInterface.TotalHeight);
        Game = new Game(inputSystem, Renderer);
    }

    public async Task InitializeAsync(string canvasId)
    {
        await Renderer.Initialize(canvasId);
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        Renderer.Clear();
        Game = new Game(InputSystem, Renderer);
        await Game.InitializeLoop(cancellationToken);
    }
}

using ECScape.Core.Engine;
using ECScape.Core.Exceptions;
using Microsoft.JSInterop;

namespace ECScape.Blazor;

public class GameEngineHost : IAsyncDisposable
{
    private readonly CanvasRenderer _renderer;
    private readonly Game _game;
    private CancellationTokenSource? _cts;

    public int Width => UiInterface.TotalWidth;
    public int Height => UiInterface.TotalHeight;

    public GameEngineHost(IJSRuntime jsRuntime, InputSystem inputSystem)
    {
        UiInterface.SetBounds(120, 30);
        _renderer = new CanvasRenderer(jsRuntime, Width, Height);
        _game = new Game(inputSystem, _renderer);
    }

    public async Task InitializeAsync(string canvasId)
    {
        await _renderer.Initialize(canvasId);
    }

    public async Task StartAsync()
    {
        _cts = new CancellationTokenSource();
        try
        {
            await _game.InitializeLoop(_cts.Token);
        }
        catch (GameOverException)
        {
            // Todo
        }
    }

    public async ValueTask DisposeAsync()
    {
        _cts?.Cancel();
        _renderer.Dispose();
    }
}
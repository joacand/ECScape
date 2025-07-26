using ECScape.Core.Engine;
using ECScape.Core.Exceptions;

namespace ECScape.Blazor;

public class GameEngineHost
{
    private readonly OutputRenderer outputRenderer;
    private readonly InputSystem inputSystem;
    private readonly Game game;
    private CancellationTokenSource? cts;

    public int Width => UiInterface.TotalWidth;
    public int Height => UiInterface.TotalHeight;

    private Func<Task>? refreshUi;

    public GameEngineHost()
    {
        UiInterface.SetBounds(120, 30); // Set dimensions
        outputRenderer = new OutputRenderer(UiInterface.TotalWidth, UiInterface.TotalHeight);
        inputSystem = new InputSystem();
        game = new Game(inputSystem, outputRenderer);
    }

    public async Task StartAsync(Func<Task> refreshUiAction)
    {
        refreshUi = refreshUiAction;
        cts = new CancellationTokenSource();
        try
        {
            await game.InitializeLoop(cts.Token, refreshUi);
        }
        catch (GameOverException)
        {
            // Handle game over logic, e.g., display message or restart
        }
    }

    public OutputRenderer.BufferEntry GetBufferEntry(int x, int y) => outputRenderer.GetBuffer()[x, y];

    public void MoveLeft() => inputSystem.LeftPressed = true;
    public void MoveRight() => inputSystem.RightPressed = true;
    public void Jump() => inputSystem.JumpPressed = true;

    public void StopGame() => cts?.Cancel();
}

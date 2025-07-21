using ECScape.Systems;

namespace ECScape.Engine;

internal sealed class Game
{
    private bool isRunning = true;
    private readonly World world = new();
    private readonly GameTimer gameTimer = new();

    public Game()
    {
        Console.CursorVisible = false;
        Console.OutputEncoding = System.Text.Encoding.UTF8;
    }

    public void InitializeLoop()
    {
        StartKeyPressListener();

        Seeder.Seed(world);
        world.Systems.AddRange(new InputSystem(), new NpcSystem(), new PhysicsSystem(), new RenderSystem());

        Loop();
    }

    public void Loop()
    {
        while (isRunning)
        {
            gameTimer.Update();
            world.Draw(gameTimer.DeltaTime);
            gameTimer.LimitFrameRate();
        }

        Console.WriteLine("Game loop has ended.");
        Console.ReadLine();
    }

    private void StartKeyPressListener()
    {
        Thread keyPressListener = new(ListenForKeyPress)
        {
            IsBackground = true
        };
        keyPressListener.Start();
    }

    private void ListenForKeyPress(object? obj)
    {
        while (isRunning)
        {
            var k = Console.ReadKey(true);
            if (k.Key == ConsoleKey.Escape)
            {
                isRunning = false;
            }
        }
    }
}

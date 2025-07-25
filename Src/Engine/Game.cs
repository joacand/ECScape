using ECScape.Exceptions;
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
        Console.BackgroundColor = ConsoleColor.DarkBlue;
        Console.Clear(); // Apply background color to entire screen
        StartKeyPressListener();
    }

    public void InitializeLoop()
    {
        Seeder.Seed(world);
        world.Systems.AddRange(new InputSystem(), new NpcSystem(), new PhysicsSystem(), new DamageSystem(), new RenderSystem(), new GameStateSystem());

        Loop();
    }

    public void Loop()
    {
        var gameOver = false;
        while (isRunning)
        {
            gameOver = GameLoop();
            if (gameOver)
            {
                break;
            }
        }

        if (gameOver)
        {
            ClearGame();
            InitializeLoop();
        }
        else
        {
            Console.WriteLine("Game loop has ended.");
            Console.ReadLine();
        }
    }

    private void ClearGame()
    {
        world.Clear();
        Console.Clear();
    }

    private bool GameLoop()
    {
        try
        {
            gameTimer.Update();
            world.Draw(gameTimer.DeltaTime);
            gameTimer.LimitFrameRate();
            return false;
        }
        catch (GameOverException)
        {
            Console.WriteLine("Game over. Press any key to restart.");
            Console.ReadLine();
            return true;
        }
        catch (GameWinException)
        {
            Console.WriteLine("You win! Press any key to restart.");
            Console.ReadLine();
            return true;
        }
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

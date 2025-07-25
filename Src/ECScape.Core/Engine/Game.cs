using ECScape.Exceptions;
using ECScape.Systems;

namespace ECScape.Engine;

public sealed class Game
{
    private bool isRunning = true;
    private readonly World world = new();
    private readonly GameTimer gameTimer = new();

    private ISystem? inputSystem;
    private ISystem? renderer;
    public Game(ISystem? inputSystem)
    {
        this.inputSystem = inputSystem;
    }

    public void InitializeLoop(ISystem? renderer = null)
    {
        this.renderer = renderer == null ? new RenderSystem() : renderer;
        Seeder.Seed(world);
        if (inputSystem != null)
        {
            world.Systems.Add(inputSystem);
        }
        world.Systems.AddRange(new NpcSystem(), new PhysicsSystem(), new DamageSystem(), this.renderer, new GameStateSystem());

        if (renderer == null)
        {
            Loop();
        }
    }

    public void RunSingleFrame()
    {
        gameTimer.Update();
        world.Draw(gameTimer.DeltaTime);
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
            InitializeLoop(renderer);
        }
        else
        {
            Console.WriteLine("Game loop has ended.");
            //  Console.ReadLine();
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
            //  Console.ReadLine();
            return true;
        }
        catch (GameWinException)
        {
            Console.WriteLine("You win! Press any key to restart.");
            // Console.ReadLine();
            return true;
        }
    }
}

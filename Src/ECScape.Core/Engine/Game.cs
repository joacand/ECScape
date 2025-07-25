using ECScape.Core.Exceptions;
using ECScape.Core.Systems;

namespace ECScape.Core.Engine;

public sealed class Game(InputSystem inputSystem)
{
    private readonly World world = new();
    private readonly GameTimer gameTimer = new();
    private readonly InputSystem inputSystem = inputSystem;
    public void InitializeLoop()
    {
        Seeder.Seed(world);
        world.Systems.AddRange(inputSystem, new NpcSystem(), new PhysicsSystem(), new DamageSystem(), new SpawnerSystem(), new RenderSystem(), new GameStateSystem());

        Loop();
    }

    public void Loop()
    {
        bool gameOver;
        while (true)
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
    }
}

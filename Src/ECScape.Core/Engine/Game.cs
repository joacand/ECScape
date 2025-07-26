using ECScape.Core.Systems;

namespace ECScape.Core.Engine;

public sealed class Game(InputSystem inputSystem, IOutputRenderer outputRenderer)
{
    private readonly World world = new();
    private readonly GameTimer gameTimer = new();

    public void InitializeLoop()
    {
        Seeder.Seed(world);
        world.Systems.AddRange(inputSystem, new NpcSystem(), new PhysicsSystem(), new DamageSystem(), new SpawnerSystem(), new RenderSystem(outputRenderer), new GameStateSystem());

        Loop();
    }

    public void Loop()
    {
        while (true)
        {
            GameLoop();
        }
    }

    private void GameLoop()
    {
        gameTimer.Update();
        world.Draw(gameTimer.DeltaTime);
        gameTimer.LimitFrameRate();
    }
}

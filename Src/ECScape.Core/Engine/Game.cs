using ECScape.Core.Systems;

namespace ECScape.Core.Engine;

public sealed class Game(InputSystem inputSystem, IOutputRenderer outputRenderer)
{
    private readonly World world = new();
    private readonly GameTimer gameTimer = new();

    public World InitializeLoop()
    {
        world.Systems.AddRange(inputSystem, new NpcSystem(), new PhysicsSystem(), new DamageSystem(), new SpawnerSystem(), new RenderSystem(outputRenderer), new GameStateSystem());
        return world;
    }

    public async Task RunLoop(CancellationToken cancellationToken)
    {
        while (!cancellationToken.IsCancellationRequested)
        {
            gameTimer.Update();
            world.Draw(gameTimer.DeltaTime);
            await gameTimer.LimitFrameRate();
        }
    }
}

using ECScape.Core.Systems;

namespace ECScape.Core.Engine;

public sealed class Game(InputSystem inputSystem, IOutputRenderer outputRenderer)
{
    private readonly World world = new();
    private readonly GameTimer gameTimer = new();

    public async Task InitializeLoop(CancellationToken cancellationToken, Func<Task>? refreshUi = null)
    {
        Seeder.Seed(world);
        world.Systems.AddRange(inputSystem, new NpcSystem(), new PhysicsSystem(), new DamageSystem(), new SpawnerSystem(), new RenderSystem(outputRenderer), new GameStateSystem());

        while (!cancellationToken.IsCancellationRequested)
        {
            gameTimer.Update();
            world.Draw(gameTimer.DeltaTime);
            refreshUi?.Invoke();
            await gameTimer.LimitFrameRate();
        }
    }
}

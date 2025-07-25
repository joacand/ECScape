using ECScape.Core.Components;
using ECScape.Core.Engine;
using ECScape.Core.Entities;
using ECScape.Core.Exceptions;

namespace ECScape.Core.Systems;

internal sealed class GameStateSystem : ISystem
{
    public void Update(World world, float deltaTime)
    {
        var player = world.Entities.FirstOrDefault(x => x.HasComponent<PlayerControllable>() && x.HasComponent<Position>() && x.HasComponent<Size>());
        if (player == null) { return; }

        CheckPlayerLose(player);
    }

    private static void CheckPlayerLose(Entity player)
    {
        var playerHealth = player.GetRequiredComponent<Health>();
        if (playerHealth.Hearts <= 0)
        {
            throw new GameOverException();
        }
    }
}

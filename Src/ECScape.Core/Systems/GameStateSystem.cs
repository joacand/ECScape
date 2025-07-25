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
        CheckPlayerWin(world.Entities);
    }

    private static void CheckPlayerLose(Entity player)
    {
        var playerSize = player.GetRequiredComponent<Size>();
        if (playerSize.Width <= 0 || playerSize.Height <= 0)
        {
            throw new GameOverException();
        }
    }

    private static void CheckPlayerWin(List<Entity> entities)
    {
        if (!entities.Where(x => x.HasComponent<Collectable>()).Any(entity => entity.GetRequiredComponent<Size>().Width > 0))
        {
            throw new GameWinException();
        }
    }
}

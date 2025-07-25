using ECScape.Components;
using ECScape.Engine;
using ECScape.Exceptions;

namespace ECScape.Systems;

internal sealed class GameStateSystem : ISystem
{
    public void Update(World world, float deltaTime)
    {
        var player = world.Entities.FirstOrDefault(x => x.HasComponent<PlayerControllable>() && x.HasComponent<Position>() && x.HasComponent<Size>());
        if (player == null) { return; }

        CheckPlayerLose(player);
        CheckPlayerWin(world.Entities);
    }

    private static void CheckPlayerLose(Entities.Entity player)
    {
        var playerSize = player.GetRequiredComponent<Size>();
        if (playerSize.Width <= 0 || playerSize.Height <= 0)
        {
            throw new GameOverException();
        }
    }

    private static void CheckPlayerWin(List<Entities.Entity> entities)
    {
        if (!entities.Where(x => x.HasComponent<Collectable>()).Any(entity => entity.GetRequiredComponent<Size>().Width > 0))
        {
            throw new GameWinException();
        }
    }
}

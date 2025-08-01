using ECScape.Core.Entities;
using ECScape.Core.Systems;

namespace ECScape.Core.Engine;

public sealed class World
{
    public static Random Random { get; } = new();

    public List<Entity> Entities { get; } = [];
    public List<ISystem> Systems { get; } = [];

    public IEnumerable<Entity> GetEntitiesWith(params Type[] types)
    {
        foreach (var e in Entities)
        {
            if (types.All(e.HasComponent))
            {
                yield return e;
            }
        }
    }

    public Entity? GetEntityWith(params Type[] types)
    {
        foreach (var e in Entities)
        {
            if (types.All(e.HasComponent))
            {
                return e;
            }
        }
        return null;
    }

    public void Draw(float deltaTime) => Systems.ForEach(x => x.Update(this, deltaTime));

    public void Clear()
    {
        Entities.Clear();
        Systems.Clear();
    }
}

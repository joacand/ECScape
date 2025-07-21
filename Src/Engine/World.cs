using ECScape.Entities;
using ECScape.Systems;

namespace ECScape.Engine;

internal sealed class World
{
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

    public void Draw(float deltaTime) => Systems.ForEach(x => x.Update(this, deltaTime));
}

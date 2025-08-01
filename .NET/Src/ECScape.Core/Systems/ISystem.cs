using ECScape.Core.Engine;

namespace ECScape.Core.Systems;

public interface ISystem
{
    public void Update(World world, float deltaTime);
}

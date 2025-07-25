using ECScape.Engine;

namespace ECScape.Systems;

public interface ISystem
{
    public void Update(World world, float deltaTime);
}

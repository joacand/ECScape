using ECScape.Engine;

namespace ECScape.Systems;

internal interface ISystem
{
    public void Update(World world, float deltaTime);
}

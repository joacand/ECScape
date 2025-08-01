using ECScape.Core.Engine;

namespace ECScape.Core.Systems;

public abstract class InputSystem : ISystem
{
    public abstract void Update(World world, float deltaTime);
}

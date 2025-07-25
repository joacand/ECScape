using ECScape.Engine;

namespace ECScape.Components;

internal sealed class AffectedByGravity : IComponent
{
    public double Gravity { get; init; } = Configuration.DefaultGravity;
}

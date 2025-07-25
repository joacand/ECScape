using ECScape.Core.Engine;

namespace ECScape.Core.Components;

internal sealed class AffectedByGravity : IComponent
{
    public double Gravity { get; init; } = Configuration.DefaultGravity;
}

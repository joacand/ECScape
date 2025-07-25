namespace ECScape.Core.Components;

internal sealed class Collectable : IComponent
{
    public TimeSpan CollectInterval { get; init; } = TimeSpan.FromSeconds(1);
}
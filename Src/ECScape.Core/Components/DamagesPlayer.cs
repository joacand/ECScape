namespace ECScape.Components;

internal sealed class DamagesPlayer : IComponent
{
    public int DamageAmount { get; init; }
    public TimeSpan DamageInterval { get; init; } = TimeSpan.FromSeconds(1);
}

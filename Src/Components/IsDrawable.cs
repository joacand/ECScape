namespace ECScape.Components;

internal sealed class IsDrawable : IComponent
{
    public char Symbol { get; init; }
    public ConsoleColor Color { get; init; } = ConsoleColor.White;
}

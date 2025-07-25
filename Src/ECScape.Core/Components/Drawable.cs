namespace ECScape.Components;

internal sealed class Drawable : IComponent
{
    public char Symbol { get; init; }
    public ConsoleColor Color { get; init; } = ConsoleColor.White;
}

namespace ECScape.Components;

internal sealed class Size(int width, int height) : IComponent
{
    public int Width { get; set; } = width;
    public int Height { get; set; } = height;
}
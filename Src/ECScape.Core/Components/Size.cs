namespace ECScape.Core.Components;

internal sealed class Size(double width, double height) : IComponent
{
    public double Width { get; set; } = width;
    public double Height { get; set; } = height;
}
namespace ECScape.Components;

internal sealed class Position(double left, double top) : IComponent
{
    public double Left { get; set; } = left;
    public double Top { get; set; } = top;

    public int LeftInt => (int)Left;
    public int TopInt => (int)Top;
}

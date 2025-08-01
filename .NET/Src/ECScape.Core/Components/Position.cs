namespace ECScape.Core.Components;

public sealed class Position(double left, double top) : IComponent
{
    public double Left { get; set; } = left;
    public double Top { get; set; } = top;

    public int LeftInt => (int)Math.Round(Left);
    public int TopInt => (int)Math.Round(Top);
}

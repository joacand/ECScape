namespace ECScape.Core.Engine;

public static class UiInterface
{
    private static readonly int InterfaceHeight = 3;
    private static int Width;
    private static int Height;

    public static void SetBounds(int width, int height)
    {
        Width = width;
        Height = height;
    }

    public static int InterfaceStart = 0;
    public static int InterfaceEnd = InterfaceHeight;

    public static int TotalWidth => Width;
    public static int TotalHeight => Height;

    public static int WorldWidth => TotalWidth;
    public static int WorldHeight => TotalHeight - 3;

    public static int WorldTop => InterfaceHeight;
    public static int WorldBottom => Height - 1;
}

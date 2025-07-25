namespace ECScape.Engine;

public static class UiInterface
{
    private static int w;
    private static int h;

    public static void SetBounds(int width, int height)
    {
        w = width;
        h = height;
    }


    private static readonly int InterfaceHeight = 3;

    public static int InterfaceStart = 0;
    public static int InterfaceEnd = InterfaceHeight;

    public static int TotalWidth => w;
    public static int TotalHeight => h;

    public static int WorldWidth => TotalWidth;
    public static int WorldHeight => TotalHeight - 3;

    public static int WorldTop => InterfaceHeight;
    public static int WorldBottom => TotalHeight - 1;
}

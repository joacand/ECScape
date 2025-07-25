namespace ECScape.Core.Engine;

internal static class UiInterface
{
    private static readonly int InterfaceHeight = 3;

    public static int InterfaceStart = 0;
    public static int InterfaceEnd = InterfaceHeight;

    public static int TotalWidth => Console.WindowWidth;
    public static int TotalHeight => Console.WindowHeight;

    public static int WorldWidth => TotalWidth;
    public static int WorldHeight => TotalHeight - 3;

    public static int WorldTop => InterfaceHeight;
    public static int WorldBottom => Console.WindowHeight - 1;
}

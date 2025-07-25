namespace ECScape.Engine;

internal static class UiInterface
{
    private static readonly int InterfaceHeight = 3;

    public static int InterfaceStart = 0;
    public static int InterfaceEnd = InterfaceHeight;

    public static int WorldWidth => Console.WindowWidth;
    public static int WorldHeight => Console.WindowHeight - 3;

    public static int WorldTop => InterfaceHeight;
    public static int WorldBottom => Console.WindowHeight - 1;
}

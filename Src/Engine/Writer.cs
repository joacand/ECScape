using ECScape.Components;

namespace ECScape.Engine;

internal static class Writer
{
    public static void Write(char character, ConsoleColor color, Position position)
    {
        Write(character.ToString(), color, position);
    }

    public static void Write(string message, ConsoleColor color, Position position)
    {
        WriteLineInt(message, color, position, Console.Write);
    }

    private static void WriteLineInt(string message, ConsoleColor color, Position position, Action<string> writeAction)
    {
        if (position.Left < 0 || position.Top < 0)
        {
            throw new Exception("Left and top must be non-negative.");
        }
        if (position.Left >= Console.WindowWidth || position.Top >= Console.WindowHeight)
        {
            throw new Exception("Left and top must be within the console window dimensions.");
        }
        var initialLeft = Console.CursorLeft;
        var initialTop = Console.CursorTop;
        var initialColor = Console.ForegroundColor;
        Console.SetCursorPosition((int)position.Left, (int)position.Top);
        Console.ForegroundColor = color;
        writeAction(message);
        Console.SetCursorPosition(initialLeft, initialTop);
        Console.ForegroundColor = initialColor;
    }
}

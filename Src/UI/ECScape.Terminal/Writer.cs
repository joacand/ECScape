using ECScape.Core;
using ECScape.Core.Components;

namespace ECScape.Terminal;

internal class Writer : IOutputRenderer
{
    public void Write(char character, ConsoleColor color, Position position)
    {
        WriteInternal(character.ToString(), color, position, Console.Write);
    }

    private static void WriteInternal(string message, ConsoleColor color, Position position, Action<string> writeAction)
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
        Console.SetCursorPosition(position.LeftInt, position.TopInt); // Left/Top are always integers from the drawing system
        Console.ForegroundColor = color;
        writeAction(message);
        Console.SetCursorPosition(initialLeft, initialTop);
        Console.ForegroundColor = initialColor;
    }
}

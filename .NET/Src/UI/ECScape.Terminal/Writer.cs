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
        if (position.Left < 0 || position.Top < 0 ||
            position.Left >= Console.WindowWidth || position.Top >= Console.WindowHeight)
        {
            return;
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

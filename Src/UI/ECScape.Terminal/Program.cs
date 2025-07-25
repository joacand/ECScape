using ECScape.Core.Engine;
using ECScape.Terminal.Systems;

namespace ECScape.Terminal;

internal class Program
{
    static void Main(string[] _)
    {
        UiInterface.SetBounds(Console.WindowWidth, Console.WindowHeight);

        Console.CursorVisible = false;
        Console.OutputEncoding = System.Text.Encoding.UTF8;
        Console.BackgroundColor = ConsoleColor.DarkBlue;
        Console.Clear();

        Game game = new(new InputSystem());
        game.InitializeLoop();
    }
}

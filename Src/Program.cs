using ECScape.Engine;

namespace ECScape;

internal class Program
{
    static void Main(string[] _)
    {
        Game game = new();
        game.InitializeLoop();
    }
}

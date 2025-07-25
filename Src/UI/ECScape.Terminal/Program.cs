using ECScape.Core.Engine;
using ECScape.Terminal.Systems;

namespace ECScape.Terminal;

internal class Program
{
    static void Main(string[] _)
    {
        Game game = new(new InputSystem());
        game.InitializeLoop();
    }
}

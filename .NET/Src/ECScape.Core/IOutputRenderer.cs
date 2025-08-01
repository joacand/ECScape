using ECScape.Core.Components;

namespace ECScape.Core;

public interface IOutputRenderer
{
    void Write(char character, ConsoleColor color, Position position);
}

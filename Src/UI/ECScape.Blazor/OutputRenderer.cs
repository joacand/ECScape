using ECScape.Core;
using ECScape.Core.Components;

namespace ECScape.Blazor;

public class OutputRenderer : IOutputRenderer
{
    public record BufferEntry(char Symbol, string FgColor, string BgColor);

    private readonly BufferEntry[,] buffer;
    private readonly int width;
    private readonly int height;

    public OutputRenderer(int width, int height)
    {
        this.width = width;
        this.height = height;
        buffer = new BufferEntry[width, height];
        ClearBuffer();
    }

    public void Write(char character, ConsoleColor color, Position position)
    {
        if (position.Left >= 0 && position.Left < width && position.Top >= 0 && position.Top < height)
        {
            buffer[position.LeftInt, position.TopInt] = new BufferEntry(character, MapColor(color), "black");
        }
    }

    public BufferEntry[,] GetBuffer() => buffer;

    public void ClearBuffer()
    {
        for (int x = 0; x < width; x++)
        {
            for (int y = 0; y < height; y++)
            {
                buffer[x, y] = new BufferEntry(' ', "white", "black");
            }
        }
    }

    private static string MapColor(ConsoleColor color)
    {
        return color switch
        {
            ConsoleColor.Black => "black",
            ConsoleColor.Blue => "blue",
            ConsoleColor.Cyan => "cyan",
            ConsoleColor.Gray => "gray",
            ConsoleColor.Green => "green",
            ConsoleColor.Magenta => "magenta",
            ConsoleColor.Red => "red",
            ConsoleColor.White => "white",
            ConsoleColor.Yellow => "yellow",
            _ => "white",
        };
    }
}

using ECScape.Components;
using ECScape.Engine;
using ECScape.Entities;

namespace ECScape.Systems;

internal sealed class RenderSystem : ISystem
{
    private readonly Entry[,] frontBuffer;
    private readonly Entry[,] backBuffer;

    public RenderSystem()
    {
        var width = Console.WindowWidth;
        var height = Console.WindowHeight;
        frontBuffer = new Entry[width, height];
        backBuffer = new Entry[width, height];
        for (var x = 0; x < width; x++)
        {
            for (var y = 0; y < height; y++)
            {
                frontBuffer[x, y] = new(' ');
                backBuffer[x, y] = new(' ');
            }
        }
    }

    public void Update(World world, float deltaTime)
    {
        for (var x = 0; x < backBuffer.GetLength(0); x++)
        {
            for (var y = 0; y < backBuffer.GetLength(1); y++)
            {
                backBuffer[x, y] = new(' ');
            }
        }

        world.Entities
            .Where(x => x.HasComponent<Position>() && x.HasComponent<IsDrawable>()).ToList()
            .ForEach(Draw);

        Render();
    }

    private void Draw(Entity entity)
    {
        var drawable = entity.GetRequiredComponent<IsDrawable>();
        var position = entity.GetRequiredComponent<Position>();
        var size = entity.GetComponent<Size>() ?? new Size(1, 1);

        for (var x = 0; x < size.Width; x++)
        {
            for (var y = 0; y < size.Height; y++)
            {
                var newPos = new Position(position.Left + x, position.Top + y);
                if (newPos.Left < 0 || newPos.Left >= backBuffer.GetLength(0) ||
                    newPos.Top < 0 || newPos.Top >= backBuffer.GetLength(1))
                {
                    continue;
                }

                backBuffer[(int)newPos.Left, (int)newPos.Top] = new(drawable.Symbol, drawable.Color);
            }
        }
    }

    private void Render()
    {
        for (var x = 0; x < frontBuffer.GetLength(0); x++)
        {
            for (var y = 0; y < frontBuffer.GetLength(1); y++)
            {
                if (frontBuffer[x, y] != backBuffer[x, y])
                {
                    Writer.Write(backBuffer[x, y].Symbol, backBuffer[x, y].Color, new Position(x, y));
                    frontBuffer[x, y] = backBuffer[x, y];
                }
            }
        }
    }

    private readonly record struct Entry(char Symbol, ConsoleColor Color)
    {
        public Entry(char symbol) : this(symbol, ConsoleColor.White) { }
    }
}

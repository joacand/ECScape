using ECScape.Core.Components;
using ECScape.Core.Engine;
using ECScape.Core.Entities;

namespace ECScape.Core.Systems;

public sealed class RenderSystem : ISystem
{
    private readonly Entry[,] frontBuffer;
    private readonly Entry[,] backBuffer;

    public RenderSystem()
    {
        var width = UiInterface.TotalWidth;
        var height = UiInterface.TotalHeight;

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
            .Where(x => x.HasComponent<Position>() && x.HasComponent<Drawable>() && x.HasComponent<Exists>()).ToList()
            .ForEach(Draw);

        DrawInterface(world.GetEntityWith(typeof(Statistics)));

        Render();
    }

    private void Draw(Entity entity)
    {
        var drawable = entity.GetRequiredComponent<Drawable>();
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

    private void DrawInterface(Entity? playerEntity)
    {
        var gameTitle = $"  ECScape  ";
        var titleIndex = 0;
        if (playerEntity != null)
        {
            var score = playerEntity?.GetComponent<Statistics>()?.Score ?? 0;
            var hearts = new string('♥', playerEntity?.GetRequiredComponent<Health>().Hearts ?? 0);
            if (string.IsNullOrWhiteSpace(hearts)) { hearts = "☠"; }
            gameTitle = $"  ECScape  ▧▧▧  Health: {hearts}  ▧▧▧  Score: {score}  ";
        }
        for (var i = 0; i < UiInterface.TotalWidth; i++)
        {
            for (var j = UiInterface.InterfaceStart; j < UiInterface.InterfaceEnd; j++)
            {
                if (i > 3 && j == 1 && titleIndex < gameTitle.Length)
                {
                    var c = gameTitle[titleIndex++];
                    backBuffer[i, j] = new(c, ConsoleColor.Cyan);
                }
                else
                {
                    backBuffer[i, j] = new('▧', ConsoleColor.Gray);
                }
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

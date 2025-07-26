using ECScape.Core;
using ECScape.Core.Engine;
using ECScape.Core.Exceptions;
using ECScape.Terminal.Systems;
using Microsoft.Extensions.Logging;

namespace ECScape.Terminal;

internal class Program
{
    static void Main(string[] _)
    {
        UiInterface.SetBounds(Console.WindowWidth, Console.WindowHeight);

        using var loggerFactory = LoggerFactory.Create(builder =>
        {
            builder
                .AddConsole()
                .SetMinimumLevel(LogLevel.Information);
        });

        ILogger logger = loggerFactory.CreateLogger<Program>();
        Log.SetLogger(logger);

        var running = true;

        while (running)
        {
            Console.CursorVisible = false;
            Console.OutputEncoding = System.Text.Encoding.UTF8;
            Console.BackgroundColor = ConsoleColor.DarkBlue;
            Console.Clear();
            Console.Title = "ECScape";

            try
            {
                Game game = new(new InputSystem(), new Writer());
                game.InitializeLoop();
            }
            catch (GameOverException)
            {
                Log.Logger.LogInformation("Game over. Press any key to restart.");
                Console.ReadLine();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An unexpected error occurred: {ex}");
                Console.WriteLine("Press any key to exit.");
                Console.ReadKey();
                running = false;
            }
        }
    }
}

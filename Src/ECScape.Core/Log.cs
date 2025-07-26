using ECScape.Core.Engine;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;

namespace ECScape.Core;

public static class Log
{
    public static ILogger Logger { get; private set; } = NullLogger.Instance;

    public static void SetLogger(ILogger logger)
    {
        Logger = logger ?? throw new ArgumentNullException(nameof(logger), "Logger cannot be null.");
    }
}

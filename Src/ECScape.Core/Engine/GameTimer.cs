using System.Diagnostics;

namespace ECScape.Core.Engine;

internal sealed class GameTimer
{
    private readonly Stopwatch stopwatch = Stopwatch.StartNew();
    private long lastFrameTimeMs;
    private const double TargetFrameTimeMs = 1000.0 / Configuration.TargetFrameRate;

    public float DeltaTime { get; private set; }

    public GameTimer()
    {
        lastFrameTimeMs = stopwatch.ElapsedMilliseconds;
    }

    public void Update()
    {
        var currentTimeMs = stopwatch.ElapsedMilliseconds;
        DeltaTime = (currentTimeMs - lastFrameTimeMs) / 1000.0f;
        lastFrameTimeMs = currentTimeMs;
    }

    public async Task LimitFrameRate()
    {
        var frameEndTimeMs = stopwatch.ElapsedMilliseconds;
        var frameProcessingTimeMs = frameEndTimeMs - lastFrameTimeMs;
        var sleepTimeMs = TargetFrameTimeMs - frameProcessingTimeMs;

        if (sleepTimeMs > 1)
        {
            await Task.Delay((int)sleepTimeMs);
        }
    }
}

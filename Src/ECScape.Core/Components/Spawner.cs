namespace ECScape.Core.Components;

internal sealed class Spawner : IComponent
{
    public DateTime LastSpawn { get; set; } = DateTime.MinValue;
    public DateTime LastRoll { get; set; } = DateTime.MinValue;
    public TimeSpan MinTimeBetweenSpawns { get; set; } = TimeSpan.FromSeconds(4);
    public TimeSpan TimeBetweenRolls { get; set; } = TimeSpan.FromSeconds(1);
    public double SpawnChance { get; set; } = 0.8;
    public bool RandomSizeHealth { get; set; } = true;
}

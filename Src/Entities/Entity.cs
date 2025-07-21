using ECScape.Components;

namespace ECScape.Entities;

internal record Entity
{
    public int Id { get; set; }
    private Dictionary<Type, IComponent> Components { get; set; } = [];

    public Entity(int id)
    {
        Id = id;
    }

    public Entity(int id, List<IComponent> components)
    {
        Id = id;
        foreach (var component in components)
        {
            AddComponent(component);
        }
    }

    public void AddComponent<T>(T component) where T : IComponent
    {
        Components[component.GetType()] = component;
    }

    public bool HasComponent<T>() where T : class, IComponent
    {
        return Components.ContainsKey(typeof(T));
    }

    public bool HasComponent(Type type)
    {
        return Components.ContainsKey(type);
    }

    public T? GetComponent<T>() where T : class, IComponent
    {
        if (!Components.TryGetValue(typeof(T), out var component))
        {
            return null;
        }
        return (T)component;
    }

    public T GetRequiredComponent<T>() where T : class, IComponent
    {
        return GetComponent<T>() ?? throw new InvalidOperationException($"Entity {Id} does not have required component of type {typeof(T).Name}");
    }
}

class Entity {
    constructor(id) {
        this.Id = id;
        this.Components = new Map();
    }

    addComponent(component) {
        this.Components.set(component.constructor, component);
    }

    removeComponent(componentType) {
        this.Components.delete(componentType);
    }

    hasComponent(componentType) {
        return this.Components.has(componentType);
    }

    getComponent(componentType) {
        return this.Components.get(componentType) || null;
    }

    getRequiredComponent(componentType) {
        const component = this.getComponent(componentType);
        if (!component) {
            throw new Error(`Entity ${this.Id} does not have required component of type ${componentType.name}`);
        }
        return component;
    }
}

export default Entity;
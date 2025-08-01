class World {
    constructor() {
        this.Entities = [];
        this.Systems = [];
        this.Random = Math.random;
    }

    getEntitiesWith(...types) {
        return this.Entities.filter(e => types.every(t => e.hasComponent(t)));
    }

    getEntityWith(...types) {
        return this.Entities.find(e => types.every(t => e.hasComponent(t)));
    }

    draw(deltaTime) {
        this.Systems.forEach(system => system.update(this, deltaTime));
    }

    clear() {
        this.Entities = [];
        this.Systems = [];
    }
}

export default World;
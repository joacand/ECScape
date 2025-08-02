import UiInterface from './uiInterface.js';
import Configuration from './configuration.js';

class World {
    constructor() {
        this.Entities = [];
        this.Systems = [];

        this.Tileset = [UiInterface.Width / Configuration.TileSize, UiInterface.Height / Configuration.TileSize];
        const tilesX = Math.floor(UiInterface.Width / Configuration.TileSize);
        const tilesY = Math.floor(UiInterface.Height / Configuration.TileSize);

        this.Tileset = Array.from({ length: tilesX }, () =>
            Array.from({ length: tilesY }, () => 1)
        );

        for (let x = 0; x < tilesX; x++) {
            for (let y = tilesY; y > tilesY - 2; y--) {
                this.Tileset[x][y] = 0;
            }
        }
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
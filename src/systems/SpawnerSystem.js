import ISystem from './ISystem.js';
import EntityFactory from '../entities/EntityFactory.js';
import { Collectable, Exists } from '../components/Components.js';
import UiInterface from '../core/uiInterface.js';

class SpawnerSystem extends ISystem {
    constructor() {
        super();
        this.lastMeteoroid = Date.now();
        this.lastPowerUp = Date.now();
        this.lastMeteoroidRoll = Date.now();
        this.lastPowerUpRoll = Date.now();
        this.minTimeBetween = 4000;
        this.timeBetweenRolls = 1000;
    }

    update(world, deltaTime) {
        this.spawnCollectables(world);
        this.spawnMeteoroid(world);
        this.spawnPowerUp(world);
    }

    spawnMeteoroid(world) {
        if (Date.now() - this.lastMeteoroid < this.minTimeBetween) return;
        if (Date.now() - this.lastMeteoroidRoll < this.timeBetweenRolls || Math.random() < 0.2) {
            this.lastMeteoroidRoll = Date.now();
            return;
        }
        EntityFactory.createMeteoroid(world, Math.floor(Math.random() * (UiInterface.WorldWidth + 1)), 1, 1);
        this.lastMeteoroid = Date.now();
    }

    spawnPowerUp(world) {
        if (Date.now() - this.lastPowerUp < this.minTimeBetween) return;
        if (Date.now() - this.lastPowerUpRoll < this.timeBetweenRolls || Math.random() < 0.3) {
            this.lastPowerUpRoll = Date.now();
            return;
        }
        EntityFactory.createPowerUp(world, Math.floor(Math.random() * (UiInterface.WorldWidth + 1)), 1, 1);
        this.lastPowerUp = Date.now();
    }

    spawnCollectables(world) {
        const collectables = world.getEntitiesWith(Collectable, Exists);
        if (collectables.length >= 2) return;

        const width = Math.floor(1 + Math.random() * 4);
        const height = Math.floor(1 + Math.random() * 4);
        EntityFactory.createCollectable(
            world,
            Math.floor(Math.random() * (UiInterface.WorldWidth + 1)),
            Math.floor(Math.random() * (UiInterface.WorldHeight + 1)),
            Math.random() < 0.5 ? '$' : '?',
            width,
            height,
            Math.min(width, height)
        );
    }
}

export default SpawnerSystem;
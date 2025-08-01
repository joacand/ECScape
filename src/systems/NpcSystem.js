import ISystem from './ISystem.js';
import { PlayerControllable, Velocity, Position, Npc } from '../components/Components.js';

class NpcSystem extends ISystem {
    constructor() {
        super();
        this.lastUpdateTimes = new Map();
        this.updateInterval = 500;
    }

    update(world, deltaTime) {
        world.getEntitiesWith(Npc, Velocity, Position).forEach(e => this.updateEntity(world, e));
    }

    updateEntity(world, entity) {
        const lastUpdate = this.lastUpdateTimes.get(entity) || 0;
        if (Date.now() - lastUpdate < this.updateInterval) return;

        const playerPosition = world.getEntityWith(PlayerControllable)?.getComponent(Position);
        const velocity = entity.getRequiredComponent(Velocity);
        const position = entity.getRequiredComponent(Position);

        // Bias to move towards the player
        let left = -200;
        let right = 200;
        const distanceToPlayer = playerPosition ?
            Math.min(Math.max((playerPosition.Left - position.Left) / 40, -1.0), 1.0) : 0;
        const bias = distanceToPlayer * 50.0;
        left += bias;
        right += bias;

        this.lastUpdateTimes.set(entity, Date.now());
        const horizontal = Math.floor(left + Math.random() * (right - left));
        let vertical = Math.floor(-10 + Math.random() * 210);
        vertical = Math.abs(vertical) < 2 ? 0 : vertical;

        velocity.Y = vertical;
        velocity.X = horizontal;
    }
}

export default NpcSystem;
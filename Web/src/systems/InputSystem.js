import ISystem from './ISystem.js';
import { PlayerControllable, Velocity } from '../components/Components.js';
import Configuration from '../core/configuration.js';

class InputSystem extends ISystem {
    constructor() {
        super();
        this.keys = {};
        window.addEventListener('keydown', (e) => this.keys[e.key] = true);
        window.addEventListener('keyup', (e) => this.keys[e.key] = false);
    }

    update(world, deltaTime) {
        world.getEntitiesWith(PlayerControllable, Velocity).forEach(e => this.updateEntity(e));
    }

    updateEntity(entity) {
        this.handlePlayerInput(entity.getRequiredComponent(Velocity));
    }

    handlePlayerInput(velocity) {
        if (this.keys['w'] || this.keys['ArrowUp']) {
            velocity.Y = Configuration.PlayerMovementVertical;
        }
        if (this.keys['a'] || this.keys['ArrowLeft']) {
            velocity.X = -Configuration.PlayerMovementHorizontal;
        }
        if (this.keys['d'] || this.keys['ArrowRight']) {
            velocity.X = Configuration.PlayerMovementHorizontal;
        }
    }
}

export default InputSystem;
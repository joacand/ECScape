import GameOverException from '../core/gameOverException.js';
import ISystem from './ISystem.js';
import { Position, Size, PlayerControllable, Health } from '../components/Components.js';

class GameStateSystem extends ISystem {
    update(world, deltaTime) {
        const player = world.Entities.find(e =>
            e.hasComponent(PlayerControllable) &&
            e.hasComponent(Position) &&
            e.hasComponent(Size)
        );
        if (!player) return;

        this.checkPlayerLose(player);
    }

    checkPlayerLose(player) {
        const playerHealth = player.getRequiredComponent(Health);
        if (playerHealth.Hearts <= 0) {
            throw new GameOverException();
        }
    }
}

export default GameStateSystem;
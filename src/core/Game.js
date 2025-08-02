import RenderSystem from '../systems/RenderSystem.js';
import InputSystem from '../systems/InputSystem.js';
import UiInterface from '../core/uiInterface.js';
import GameOverException from './gameOverException.js';
import World from './World.js';
import GameTimer from './GameTimer.js';
import Seeder from './Seeder.js';
import NpcSystem from '../systems/NpcSystem.js';
import PhysicsSystem from '../systems/PhysicsSystem.js';
import DamageSystem from '../systems/DamageSystem.js';
import SpawnerSystem from '../systems/SpawnerSystem.js';
import GameStateSystem from '../systems/GameStateSystem.js';
import Configuration from './configuration.js';

class Game {
    async start() {
        document.addEventListener('DOMContentLoaded', async () => {
            const canvas = document.getElementById('gameCanvas');
            const gameOverDiv = document.getElementById('gameOver');
            const restartButton = document.getElementById('restartButton');

            UiInterface.setBounds(
                Configuration.GameWidth,
                Configuration.GameHeight
            );

            window.addEventListener('resize', () => {
                UiInterface.setBounds(
                    Configuration.GameWidth,
                    Configuration.GameHeight
                );
            });

            let cancellationToken = { isCancellationRequested: false };

            const runGame = async () => {
                this.world = new World();
                this.gameTimer = new GameTimer();
                this.renderSystem = new RenderSystem(canvas);

                gameOverDiv.style.display = 'none';
                cancellationToken = { isCancellationRequested: false };

                try {
                    await this.initializeLoop(cancellationToken);
                } catch (e) {
                    if (e instanceof GameOverException) {
                        gameOverDiv.style.display = 'block';
                    } else {
                        console.error('An unexpected error occurred:', e);
                        alert(`An unexpected error occurred: ${e.message}`);
                    }
                }
            }

            restartButton.addEventListener('click', () => {
                cancellationToken.isCancellationRequested = true;
                setTimeout(runGame, 100);
            });

            await runGame();
        });
    }

    async initializeLoop(cancellationToken) {
        Seeder.seed(this.world);
        this.world.Systems.push(
            new InputSystem(),
            new NpcSystem(),
            new PhysicsSystem(),
            new DamageSystem(),
            new SpawnerSystem(),
            this.renderSystem,
            new GameStateSystem()
        );

        while (!cancellationToken.isCancellationRequested) {
            this.gameTimer.update();
            this.world.draw(this.gameTimer.deltaTime);
            await this.gameTimer.limitFrameRate();
        }
    }
}

export default Game;
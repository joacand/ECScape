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

class Game {
    constructor(canvas) {
        this.world = new World();
        this.gameTimer = new GameTimer();
        this.inputSystem = new InputSystem();
        this.renderSystem = new RenderSystem(canvas);
    }

    async start() {
        document.addEventListener('DOMContentLoaded', () => {
            const canvas = document.getElementById('gameCanvas');
            const gameOverDiv = document.getElementById('gameOver');
            const restartButton = document.getElementById('restartButton');

            UiInterface.setBounds(
                Math.floor(window.innerWidth / 10),
                Math.floor(window.innerHeight / 10)
            );

            window.addEventListener('resize', () => {
                UiInterface.setBounds(
                    Math.floor(window.innerWidth / 10),
                    Math.floor(window.innerHeight / 10)
                );
            });

            let cancellationToken = { isCancellationRequested: false };

            const runGame = async () => {
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

            runGame();
        });
    }

    async initializeLoop(cancellationToken) {
        Seeder.seed(this.world);
        this.world.Systems.push(
            this.inputSystem,
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
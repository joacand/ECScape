
// ===== File: src\components\Components.js =====

import Configuration from '../core/configuration.js';

export class IComponent { }

export class AffectedByGravity extends IComponent {
    constructor(gravity = Configuration.DefaultGravity) {
        super();
        this.Gravity = gravity;
    }
}

export class Collectable extends IComponent {
    constructor(collectInterval = 1000, scoreAmount = 1) {
        super();
        this.CollectInterval = collectInterval;
        this.ScoreAmount = scoreAmount;
    }
}

export class DamagesPlayer extends IComponent {
    constructor(damageAmount, damageInterval = 1000) {
        super();
        this.DamageAmount = damageAmount;
        this.DamageInterval = damageInterval;
    }
}

export class Drawable extends IComponent {
    constructor(symbol, color = 'white', sprite = null) {
        super();
        this.Symbol = symbol;
        this.Color = color;
        this.Sprite = sprite;
    }
}

export class Exists extends IComponent { }

export class Health extends IComponent {
    constructor(hearts = 3) {
        super();
        this.Hearts = hearts;
    }
}

export class Invulnerable extends IComponent {
    constructor(expirationTime) {
        super();
        this.ExpirationTime = expirationTime;
    }
}

export class LimitedByBounds extends IComponent { }

export class Npc extends IComponent { }

export class PlayerControllable extends IComponent { }

export class Position extends IComponent {
    constructor(left, top) {
        super();
        this.Left = left;
        this.Top = top;
    }

    get LeftInt() { return Math.floor(this.Left); }
    get TopInt() { return Math.floor(this.Top); }
}

export class PowerUpHealth extends IComponent { }

export class Size extends IComponent {
    constructor(width, height) {
        if (!width) { width = 10; }
        if (!height) { height = 10; }
        super();
        this.Width = width;
        this.Height = height;
    }
}

export class Solid extends IComponent { }

export class Statistics extends IComponent {
    constructor(score = 0) {
        super();
        this.Score = score;
    }
}

export class Velocity extends IComponent {
    constructor(x = 0, y = 0) {
        super();
        this.X = x;
        this.Y = y;
    }
}

// ===== File: src\core\configuration.js =====

const Configuration = {
    TargetFrameRate: 120.0,
    MovementDecayRate: 13,
    PlayerMovementVertical: 600,
    PlayerMovementHorizontal: 200,
    DefaultGravity: 300
};

export default Configuration;

// ===== File: src\core\Game.js =====

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
        this.renderSystem = new RenderSystem(canvas);
    }

    async start() {
        document.addEventListener('DOMContentLoaded', async () => {
            const canvas = document.getElementById('gameCanvas');
            const gameOverDiv = document.getElementById('gameOver');
            const restartButton = document.getElementById('restartButton');

            UiInterface.setBounds(
                640,
                360
            );

            window.addEventListener('resize', () => {
                UiInterface.setBounds(
                    640,
                    360
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

// ===== File: src\core\gameOverException.js =====

class GameOverException extends Error { }

export default GameOverException;

// ===== File: src\core\GameTimer.js =====

import Configuration from './configuration.js';

class GameTimer {
    constructor() {
        this.lastFrameTimeMs = performance.now();
        this.targetFrameTimeMs = 1000 / Configuration.TargetFrameRate;
        this.deltaTime = 0;
    }

    update() {
        const currentTimeMs = performance.now();
        this.deltaTime = (currentTimeMs - this.lastFrameTimeMs) / 1000;
        this.lastFrameTimeMs = currentTimeMs;
    }

    async limitFrameRate() {
        const frameEndTimeMs = performance.now();
        const frameProcessingTimeMs = frameEndTimeMs - this.lastFrameTimeMs;
        const sleepTimeMs = this.targetFrameTimeMs - frameProcessingTimeMs;

        if (sleepTimeMs > 1) {
            await new Promise(resolve => setTimeout(resolve, sleepTimeMs));
        }
    }
}

export default GameTimer;

// ===== File: src\core\Seeder.js =====

import EntityFactory from '../entities/EntityFactory.js';
import UiInterface from '../core/uiInterface.js';

class Seeder {
    static seed(world) {
        EntityFactory.createPlayer(world, 0, 0);

        EntityFactory.createEnemy(world, 30, 0, 'X', 30, 20);
        EntityFactory.createEnemy(world, 30, 0, '%', 30, 10);
        EntityFactory.createEnemy(world, 10, 0, '#', 20, 10);

        EntityFactory.createGroundBlock(world, 0, UiInterface.WorldBottom - 20, UiInterface.WorldWidth, 30);
        EntityFactory.createCloudBlock(world, 200, 200, 30, 30);
    }
}

export default Seeder;

// ===== File: src\core\uiInterface.js =====

const UiInterface = {
    InterfaceHeight: 30,
    Width: 0,
    Height: 0,

    setBounds: function (width, height) {
        this.Width = width;
        this.Height = height;
    },

    get InterfaceStart() { return 0; },
    get InterfaceEnd() { return this.InterfaceHeight; },

    get TotalWidth() { return this.Width; },
    get TotalHeight() { return this.Height; },

    get WorldWidth() { return this.TotalWidth; },
    get WorldHeight() { return this.TotalHeight - 30; },
    get WorldTop() { return this.InterfaceHeight; },
    get WorldBottom() { return this.Height - 1; }
};

export default UiInterface;

// ===== File: src\core\World.js =====

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

// ===== File: src\entities\Entity.js =====

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

// ===== File: src\entities\EntityFactory.js =====

import {
    Exists, Health, AffectedByGravity, LimitedByBounds, Position, Drawable, Size, Velocity, PlayerControllable, Statistics, Invulnerable, Npc, DamagesPlayer,
    PowerUpHealth, Collectable, Solid
} from '../components/Components.js';
import Entity from '../entities/Entity.js';
import UiInterface from '../core/uiInterface.js';

class EntityFactory {
    static idCounter = 0;

    static create(world, components) {
        const id = this.idCounter++;
        const entity = new Entity(id);
        components.forEach(c => entity.addComponent(c));
        world.Entities.push(entity);
        return entity;
    }

    static createPlayer(world, left, top) {
        return this.create(world, [
            new Exists(),
            new Health(),
            new AffectedByGravity(),
            new LimitedByBounds(),
            new Position(left, top),
            new Drawable('?', 'green', document.getElementById('playerSprite')),
            new Size(30, 30),
            new Velocity(),
            new PlayerControllable(),
            new Statistics(),
            new Invulnerable(Date.now() + 3000),
        ]);
    }

    static createEnemy(world, left, top, symbol, width, height) {
        return this.create(world, [
            new Exists(),
            new AffectedByGravity(),
            new LimitedByBounds(),
            new Position(left, top),
            new Npc(),
            new Drawable(symbol, 'red', document.getElementById('enemySprite')),
            new Size(width, height),
            new Velocity(),
            new DamagesPlayer(1)
        ]);
    }

    static createMeteoroid(world, left, width, height) {
        return this.create(world, [
            new Exists(),
            new AffectedByGravity(),
            new Position(left, UiInterface.WorldTop),
            new Drawable('?', 'darkred', document.getElementById('enemySprite')),
            new Size(width, height),
            new Velocity(
                Math.floor(-2 + Math.random() * 4),
                5
            ),
            new DamagesPlayer(1)
        ]);
    }

    static createPowerUp(world, left, width, height) {
        return this.create(world, [
            new Exists(),
            new AffectedByGravity(3),
            new PowerUpHealth(),
            new Position(left, UiInterface.WorldTop),
            new Drawable('+', 'cyan'),
            new Size(width, height),
            new Velocity(
                Math.floor(-2 + Math.random() * 4),
                0
            )
        ]);
    }

    static createCollectable(world, left, top, symbol, width, height, hearts) {
        return this.create(world, [
            new Exists(),
            new Health(hearts),
            new AffectedByGravity(),
            new LimitedByBounds(),
            new Position(left, top),
            new Npc(),
            new Drawable(symbol, 'yellow', document.getElementById('collectableSprite')),
            new Size(width, height),
            new Velocity(),
            new Collectable(),
            new Invulnerable(Date.now() + 3000),
        ]);
    }

    static createGroundBlock(world, left, top, width, height) {
        return this.create(world, [
            new Exists(),
            new Position(left, top),
            new Drawable('=', 'gray', document.getElementById('groundSprite')),
            new Size(width, height),
            new LimitedByBounds(),
            new Solid()
        ]);
    }

    static createCloudBlock(world, left, top, width, height) {
        return this.create(world, [
            new Exists(),
            new Position(left, top),
            new Drawable('=', 'magenta', document.getElementById('groundSprite')),
            new Size(width, height),
            new LimitedByBounds(),
            new Solid()
        ]);
    }
}

export default EntityFactory;

// ===== File: src\systems\DamageSystem.js =====

import ISystem from './ISystem.js';
import { Position, Size, DamagesPlayer, Collectable, PowerUpHealth, Invulnerable, Exists, PlayerControllable, Health, Statistics } from '../components/Components.js';

class DamageSystem extends ISystem {
    update(world, deltaTime) {
        world.getEntitiesWith(DamagesPlayer, Position, Exists).forEach(e => this.updateEntity(e, world));
        world.getEntitiesWith(Collectable, Position, Exists).forEach(e => this.updateCollectibles(e, world));
        world.getEntitiesWith(PowerUpHealth, Position, Exists).forEach(e => this.updatePowerUps(e, world));
    }

    updateEntity(entity, world) {
        const position = entity.getRequiredComponent(Position);
        const size = entity.getComponent(Size) || new Size(1, 1);
        const damageComponent = entity.getRequiredComponent(DamagesPlayer);

        const player = world.getEntityWith(PlayerControllable, Position);
        if (!player) return;

        const playerPosition = player.getRequiredComponent(Position);
        const playerSize = player.getComponent(Size) || new Size(1, 1);
        const invulnerable = player.getComponent(Invulnerable);

        if (this.isColliding(position, size, playerPosition, playerSize) && this.isVulnerable(invulnerable)) {
            const playerHealth = player.getRequiredComponent(Health);
            playerHealth.Hearts -= damageComponent.DamageAmount;
            player.addComponent(new Invulnerable(Date.now() + damageComponent.DamageInterval));

            const damage = damageComponent.DamageAmount;
            playerSize.Width /= 2;
            playerSize.Height /= 2;
            if (playerSize.Width <= 0) playerSize.Width = 1;
            if (playerSize.Height <= 0) playerSize.Height = 1;
        }
    }

    updateCollectibles(entity, world) {
        const position = entity.getRequiredComponent(Position);
        const collectableComponent = entity.getRequiredComponent(Collectable);
        const size = entity.getComponent(Size) || new Size(1, 1);
        const invulnerable = entity.getComponent(Invulnerable);

        const player = world.getEntityWith(PlayerControllable, Position);
        if (!player) return;

        const playerPosition = player.getRequiredComponent(Position);
        const playerSize = player.getComponent(Size) || new Size(1, 1);

        if (this.isColliding(position, size, playerPosition, playerSize) && this.isVulnerable(invulnerable)) {
            const health = entity.getRequiredComponent(Health);
            entity.addComponent(new Invulnerable(Date.now() + collectableComponent.CollectInterval));
            health.Hearts -= 1;
            size.Width /= 2;
            size.Height /= 2;
            if (size.Width <= 0) size.Width = 1;
            if (size.Height <= 0) size.Height = 1;
            if (health.Hearts <= 0) {
                entity.removeComponent(Exists);
            }
            const statistics = player.getRequiredComponent(Statistics);
            statistics.Score += collectableComponent.ScoreAmount;
        }
    }

    updatePowerUps(entity, world) {
        const position = entity.getRequiredComponent(Position);
        const size = entity.getComponent(Size) || new Size(1, 1);

        const player = world.getEntityWith(PlayerControllable, Position);
        if (!player) return;

        const playerPosition = player.getRequiredComponent(Position);
        const playerSize = player.getComponent(Size) || new Size(1, 1);

        if (this.isColliding(position, size, playerPosition, playerSize)) {
            const playerHealth = player.getRequiredComponent(Health);
            playerHealth.Hearts += 1;
            playerSize.Width *= 2;
            playerSize.Height *= 2;
            entity.removeComponent(Exists);
            const statistics = player.getRequiredComponent(Statistics);
            statistics.Score += 1;
        }
    }

    isColliding(position, size, position2, size2) {
        return position.LeftInt < position2.LeftInt + size2.Width &&
            position.LeftInt + size.Width > position2.LeftInt &&
            position.TopInt < position2.TopInt + size2.Height &&
            position.TopInt + size.Height > position2.TopInt;
    }

    isVulnerable(invulnerable) {
        return !invulnerable || Date.now() > invulnerable.ExpirationTime;
    }
}

export default DamageSystem;

// ===== File: src\systems\GameStateSystem.js =====

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

// ===== File: src\systems\InputSystem.js =====

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

// ===== File: src\systems\ISystem.js =====

class ISystem {
    update(world, deltaTime) {
        throw new Error("Method 'update' must be implemented");
    }
}

export default ISystem;

// ===== File: src\systems\NpcSystem.js =====

import ISystem from './ISystem.js';
import { PlayerControllable, Velocity, Position, Npc, DamagesPlayer } from '../components/Components.js';

class NpcSystem extends ISystem {
    constructor() {
        super();
        this.lastUpdateTimes = new Map();
        this.updateInterval = 100;
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
        const damagesPlayer = entity.getComponent(DamagesPlayer);

        // Bias to move towards the player     
        let left = -500;
        let right = 500;
        if (damagesPlayer) {
            const distanceToPlayer = playerPosition ?
                Math.min(Math.max((playerPosition.Left - position.Left) / 40, -1.0), 1.0) : 0;
            const bias = distanceToPlayer * 100.0;
            left += bias;
            right += bias;
        }

        this.lastUpdateTimes.set(entity, Date.now());
        const horizontal = Math.floor(left + Math.random() * (right - left));
        let vertical = Math.floor(-1500 + Math.random() * 3100);
        vertical = Math.abs(vertical) < 2 ? 0 : vertical;

        velocity.Y = vertical;
        velocity.X = horizontal;
    }
}

export default NpcSystem;

// ===== File: src\systems\PhysicsSystem.js =====

import ISystem from './ISystem.js';
import UiInterface from '../core/uiInterface.js';
import { Velocity, Position, AffectedByGravity, Size, Solid, LimitedByBounds } from '../components/Components.js';
import Configuration from '../core/configuration.js';

class PhysicsSystem extends ISystem {
    update(world, deltaTime) {
        world.getEntitiesWith(Position, AffectedByGravity).forEach(e =>
            this.updateEntity(e, world, deltaTime)
        );
    }

    updateEntity(entity, world, deltaTime) {
        const gravity = entity.getRequiredComponent(AffectedByGravity).Gravity;
        const position = entity.getRequiredComponent(Position);
        const size = entity.getComponent(Size) || new Size(1, 1);

        const originalPosition = new Position(position.Left, position.Top);

        position.Top += gravity * deltaTime;

        if (entity.hasComponent(Velocity)) {
            this.handleVelocity(entity.getRequiredComponent(Velocity), position, deltaTime);
        }

        if (entity.hasComponent(LimitedByBounds)) {
            this.limitBounds(position, size);
            this.limitBySolidEntities(world, size, position, originalPosition);
        }
    }

    limitBounds(position, size) {
        if (position.Left < 0) {
            position.Left = 0;
        }
        if (position.Left + size.Width >= UiInterface.WorldWidth) {
            position.Left = UiInterface.WorldWidth - size.Width;
        }
        if (position.Top < UiInterface.WorldTop) {
            position.Top = UiInterface.WorldTop;
        }
        if (position.Top + size.Height >= UiInterface.WorldBottom) {
            position.Top = UiInterface.WorldBottom;
        }
    }

    handleVelocity(velocity, position, deltaTime) {
        position.Top -= velocity.Y * deltaTime;
        position.Left += velocity.X * deltaTime;

        velocity.X *= 1.0 - deltaTime * Configuration.MovementDecayRate;
        velocity.Y *= 1.0 - deltaTime * Configuration.MovementDecayRate;

        // Zero out very small values to prevent jitter
        if (Math.abs(velocity.X) < 0.1) velocity.X = 0;
        if (Math.abs(velocity.Y) < 0.1) velocity.Y = 0;
    }

    limitBySolidEntities(world, size, position, originalPosition) {
        if (this.isBlocked(position, size, world.getEntitiesWith(Position, Solid))) {
            position.Top = originalPosition.Top;
            if (this.isBlocked(position, size, world.getEntitiesWith(Position, Solid))) {
                position.Left = originalPosition.Left;
            }
        }
    }

    isBlocked(position, size, solidPositions) {
        return solidPositions.some(s => {
            const sPos = s.getRequiredComponent(Position);
            const sSize = s.getRequiredComponent(Size);
            return sPos.LeftInt < position.LeftInt + size.Width &&
                sPos.LeftInt + sSize.Width > position.LeftInt &&
                sPos.TopInt < position.TopInt + size.Height &&
                sPos.TopInt + sSize.Height > position.TopInt;
        });
    }
}

export default PhysicsSystem;

// ===== File: src\systems\RenderSystem.js =====

import ISystem from './ISystem.js';
import UiInterface from '../core/uiInterface.js';
import { Position, Size, Drawable, Exists, Statistics, Health } from '../components/Components.js';

class RenderSystem extends ISystem {
    constructor(canvas) {
        super();
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = UiInterface.TotalWidth;
        this.canvas.height = UiInterface.TotalHeight;
    }

    update(world, deltaTime) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw world entities
        world.getEntitiesWith(Position, Drawable, Exists).forEach(e => this.drawEntity(e));

        // Draw interface
        this.drawInterface(world.getEntityWith(Statistics));
    }

    drawEntity(entity) {
        const drawable = entity.getRequiredComponent(Drawable);
        const position = entity.getRequiredComponent(Position);
        const size = entity.getComponent(Size) || new Size();

        this.ctx.fillStyle = drawable.Color;

        if (drawable.Sprite) {
            this.ctx.drawImage(
                drawable.Sprite,
                position.Left,
                position.Top,
                size.Width,
                size.Height
            );
        }
    }

    drawInterface(playerEntity) {
        this.ctx.fillStyle = 'gray';
        this.ctx.fillRect(0, 0, this.canvas.width, UiInterface.InterfaceEnd);

        this.ctx.fillStyle = 'cyan';
        this.ctx.font = 'bold 16px monospace';
        this.ctx.textAlign = 'center';

        let gameTitle = "  ECScape  ";
        if (playerEntity) {
            const score = playerEntity.getComponent(Statistics)?.Score || 0;
            const hearts = '♥'.repeat(playerEntity.getRequiredComponent(Health).Hearts || 0);
            gameTitle = `  ECScape  ♥♥♥  Health: ${hearts}  ♥♥♥  Score: ${score}  `;
        }

        this.ctx.fillText(
            gameTitle,
            this.canvas.width / 2,
            UiInterface.InterfaceStart + 20
        );
    }
}

export default RenderSystem;

// ===== File: src\systems\SpawnerSystem.js =====

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
        EntityFactory.createMeteoroid(world, Math.floor(Math.random() * (UiInterface.WorldWidth + 1)), 10, 10);
        this.lastMeteoroid = Date.now();
    }

    spawnPowerUp(world) {
        if (Date.now() - this.lastPowerUp < this.minTimeBetween) return;
        if (Date.now() - this.lastPowerUpRoll < this.timeBetweenRolls || Math.random() < 0.3) {
            this.lastPowerUpRoll = Date.now();
            return;
        }
        EntityFactory.createPowerUp(world, Math.floor(Math.random() * (UiInterface.WorldWidth + 1)), 10, 10);
        this.lastPowerUp = Date.now();
    }

    spawnCollectables(world) {
        const collectables = world.getEntitiesWith(Collectable, Exists);
        if (collectables.length >= 2) return;

        const width = Math.floor(1 + Math.random() * 4) * 10;
        const height = Math.floor(1 + Math.random() * 4) * 10;
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

// ===== File: index.html =====

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>《⧼ ECScape ⧽》</title>
    <link rel="stylesheet" href="styles.css">
</head>

<body>
    <div id="gameContainer">
        <canvas id="gameCanvas"></canvas>
        <div id="gameOver">
            Game Over! <br>
            <button id="restartButton">Restart</button>
        </div>
    </div>
    <img id="collectableSprite" src="./res/collectable.png" alt="sprite" />
    <img id="groundSprite" src="./res/ground.png" alt="sprite" />
    <img id="playerSprite" src="./res/player.png" alt="sprite" />
    <img id="enemySprite" src="./res/enemy.png" alt="sprite" />
    <script type="module" src="./main.js"></script>
</body>

</html>

// ===== File: main.js =====

import Game from './src/core/Game.js';

const canvas = document.getElementById('gameCanvas');
const game = new Game(canvas);
await game.start();

// ===== File: styles.css =====

body {
    margin: 0;
    padding: 0;
    background-color: #000033;
    overflow: hidden;
    font-family: monospace;
}

#gameContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
}

#gameCanvas {
    border: 2px solid #444;
    background-color: #000033;
}

#gameOver {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 24px;
    background-color: rgba(0, 0, 0, 0.7);
    padding: 20px;
    border-radius: 10px;
    display: none;
}

#restartButton {
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 18px;
    cursor: pointer;
}

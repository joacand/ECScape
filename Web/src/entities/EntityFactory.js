import {
    Exists, Health, AffectedByGravity, LimitedByBounds, Position, Drawable, Size, Velocity, PlayerControllable,
    Statistics, Invulnerable, Npc, DamagesPlayer, PowerUpHealth, Collectable, Solid
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
            new Drawable('?', 'green', document.getElementById('playerSprite'), false),
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
            new Drawable(symbol, 'red', document.getElementById('enemySprite'), false),
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
            new Drawable('?', 'darkred', document.getElementById('enemySprite'), false),
            new Size(width, height),
            new Velocity(
                Math.floor(-2 + Math.random() * 4),
                0
            ),
            new DamagesPlayer(1)
        ]);
    }

    static createPowerUp(world, left, width, height) {
        return this.create(world, [
            new Exists(),
            new AffectedByGravity(200),
            new PowerUpHealth(),
            new Position(left, UiInterface.WorldTop),
            new Drawable('+', 'cyan', document.getElementById('powerupSprite'), false),
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
            new Drawable(symbol, 'yellow', document.getElementById('collectableSprite'), false),
            new Size(width, height),
            new Velocity(),
            new Collectable(),
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
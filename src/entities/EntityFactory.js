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
            new Drawable('?', 'green'),
            new Size(3, 3),
            new Velocity(),
            new PlayerControllable(),
            new Statistics(),
            new Invulnerable({
                ExpirationTime: Date.now() + 3000
            }),
        ]);
    }

    static createEnemy(world, left, top, symbol, width, height) {
        return this.create(world, [
            new Exists(),
            new AffectedByGravity(),
            new LimitedByBounds(),
            new Position(left, top),
            new Npc(),
            new Drawable(symbol, 'red'),
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
            new Drawable('?', 'darkred'),
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
            new Drawable(symbol, 'yellow'),
            new Size(width, height),
            new Velocity(),
            new Collectable(),
            new Invulnerable({
                ExpirationTime: Date.now() + 3000
            }),
        ]);
    }

    static createGroundBlock(world, left, top) {
        return this.create(world, [
            new Exists(),
            new Position(left, top),
            new Drawable('=', 'gray'),
            new Size(1, 1),
            new LimitedByBounds(),
            new Solid()
        ]);
    }

    static createCloudBlock(world, left, top) {
        return this.create(world, [
            new Exists(),
            new Position(left, top),
            new Drawable('=', 'magenta'),
            new Size(1, 1),
            new LimitedByBounds(),
            new Solid()
        ]);
    }
}

export default EntityFactory;
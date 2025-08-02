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
            playerSize.Width -= playerSize.OriginalWidth / 2;
            playerSize.Height -= playerSize.OriginalHeight / 2;
            if (playerSize.Width <= 0) playerSize.Width = 10;
            if (playerSize.Height <= 0) playerSize.Height = 10;
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
            size.Width -= size.OriginalWidth / 2;
            size.Height -= size.OriginalHeight / 2;
            if (size.Width <= 0) size.Width = 10;
            if (size.Height <= 0) size.Height = 10;
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
            playerSize.Width += playerSize.OriginalWidth / 2;
            playerSize.Height += playerSize.OriginalHeight / 2
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
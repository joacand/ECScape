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
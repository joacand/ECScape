import ISystem from './ISystem.js';
import UiInterface from '../core/uiInterface.js';
import { Position, Size, Drawable, Exists, Statistics, Health } from '../components/Components.js';

class RenderSystem extends ISystem {
    constructor(canvas) {
        super();
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.cellSize = 10; // Size of each cell in pixels
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = UiInterface.TotalWidth * this.cellSize;
        this.canvas.height = UiInterface.TotalHeight * this.cellSize;
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
        const size = entity.getComponent(Size) || new Size(1, 1);

        this.ctx.fillStyle = drawable.Color;

        for (let x = 0; x < size.Width; x++) {
            for (let y = 0; y < size.Height; y++) {
                const newPos = {
                    Left: position.Left + x,
                    Top: position.Top + y
                };

                if (newPos.Left < 0 || newPos.Left >= UiInterface.TotalWidth ||
                    newPos.Top < 0 || newPos.Top >= UiInterface.TotalHeight) {
                    continue;
                }

                this.ctx.fillText(
                    drawable.Symbol,
                    newPos.Left * this.cellSize + this.cellSize / 2,
                    newPos.Top * this.cellSize + this.cellSize / 2
                );
            }
        }
    }

    drawInterface(playerEntity) {
        this.ctx.fillStyle = 'gray';
        this.ctx.fillRect(0, 0, this.canvas.width, UiInterface.InterfaceEnd * this.cellSize);

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
            (UiInterface.InterfaceStart + 1) * this.cellSize + this.cellSize / 2
        );
    }
}

export default RenderSystem;
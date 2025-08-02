import ISystem from './ISystem.js';
import UiInterface from '../core/uiInterface.js';
import { Position, Size, Drawable, Exists, Statistics, Health } from '../components/Components.js';

class RenderSystem extends ISystem {
    constructor(canvas) {
        super();
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.scaleFactor = 1;
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        const maxWidth = window.innerWidth;
        const maxHeight = window.innerHeight;

        this.scaleFactor = Math.floor(Math.min(maxWidth / UiInterface.TotalWidth, maxHeight / UiInterface.TotalHeight));

        this.canvas.width = UiInterface.TotalWidth * this.scaleFactor;
        this.canvas.height = UiInterface.TotalHeight * this.scaleFactor;
    }

    update(world, deltaTime) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.scale(this.scaleFactor, this.scaleFactor);

        this.drawTileset(world.Tileset);

        world.getEntitiesWith(Position, Drawable, Exists).forEach(e => this.drawEntity(e));
        this.drawInterface(world.getEntityWith(Statistics));
        this.ctx.restore();
    }

    drawTileset(tileset) {
        if (!tileset) return;

        const tileSize = 32;
        const tilesetImage = document.getElementById('tileset');

        for (let x = 0; x < tileset.length; x++) {
            for (let y = 0; y < tileset[x].length; y++) {
                const tileID = tileset[x][y];
                if (tileID !== 0 && tileID !== 1) continue;

                this.ctx.drawImage(
                    tilesetImage,
                    tileID * tileSize, 0, tileSize, tileSize,
                    x * tileSize, y * tileSize, tileSize, tileSize
                );
            }
        }
    }

    drawEntity(entity) {
        const drawable = entity.getRequiredComponent(Drawable);
        const position = entity.getRequiredComponent(Position);
        const size = entity.getComponent(Size) || new Size();

        this.ctx.fillStyle = drawable.Color;

        if (drawable.Sprite) {
            const spriteWidth = drawable.SpriteWidth;
            const spriteHeight = drawable.SpriteHeight;

            if (size.Width < spriteWidth || size.Height < spriteHeight || !drawable.Tileable) {
                if (position.Direction === 'l') {
                    this.ctx.save();
                    this.ctx.translate(position.Left + size.Width, position.Top);
                    this.ctx.scale(-1, 1);
                    this.ctx.drawImage(
                        drawable.Sprite,
                        0,
                        0,
                        size.Width,
                        size.Height
                    );
                    this.ctx.restore();
                } else {
                    this.ctx.drawImage(
                        drawable.Sprite,
                        position.Left,
                        position.Top,
                        size.Width,
                        size.Height
                    );
                }
            }
            else {
                const tilesX = Math.ceil(size.Width / spriteWidth);
                const tilesY = Math.ceil(size.Height / spriteHeight);

                for (let y = 0; y < tilesY; y++) {
                    const currentY = position.Top + (y * spriteHeight);
                    const currentHeight = y === tilesY - 1
                        ? size.Height - (y * spriteHeight)
                        : spriteHeight;

                    for (let x = 0; x < tilesX; x++) {
                        const currentX = position.Left + (x * spriteWidth);
                        const currentWidth = x === tilesX - 1
                            ? size.Width - (x * spriteWidth)
                            : spriteWidth;

                        this.ctx.drawImage(
                            drawable.Sprite,
                            0, 0,
                            spriteWidth, spriteHeight,
                            currentX, currentY,
                            currentWidth, currentHeight
                        );
                    }
                }
            }
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
            gameTitle = `  ECScape     Health: ${hearts}     Score: ${score}  `;
        }

        this.ctx.fillText(
            gameTitle,
            UiInterface.TotalWidth / 2,
            UiInterface.InterfaceStart + 20
        );
    }
}

export default RenderSystem;
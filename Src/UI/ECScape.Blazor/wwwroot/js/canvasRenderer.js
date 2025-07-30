class CanvasRenderer {
    constructor(canvasId, width, height) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = width;
        this.height = height;
        this.cellWidth = 0;
        this.cellHeight = 0;
        this.fontSize = 16;

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        const availableWidth = this.canvas.parentElement.clientWidth;
        const availableHeight = window.innerHeight * 0.8;

        this.cellWidth = Math.floor(availableWidth / this.width);
        this.cellHeight = Math.floor(availableHeight / this.height);
        this.fontSize = Math.min(this.cellWidth, this.cellHeight) * 0.8;

        this.canvas.width = this.width * this.cellWidth;
        this.canvas.height = this.height * this.cellHeight;

        this.ctx.font = `${this.fontSize}px monospace`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
    }

    drawCharacter(x, y, char, color) {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(x * this.cellWidth, y * this.cellHeight, this.cellWidth, this.cellHeight);

        this.ctx.fillStyle = color;
        this.ctx.fillText(
            char,
            x * this.cellWidth + this.cellWidth / 2,
            y * this.cellHeight + this.cellHeight / 2
        );
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

let renderer;

function initialize(dotNetRef, canvasId, width, height) {
    renderer = new CanvasRenderer(canvasId, width, height);
}

function drawCharacter(x, y, char, color) {
    if (renderer) {
        renderer.drawCharacter(x, y, char, color);
    }
}
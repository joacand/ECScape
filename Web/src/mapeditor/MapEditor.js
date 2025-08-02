import Configuration from '../core/configuration.js';
import UiInterface from '../core/uiInterface.js';
import tilemap from '../core/tilemap.js'; 

class MapEditor {
    initialize() {
        UiInterface.setBounds(
            Configuration.GameWidth,
            Configuration.GameHeight
        );

        const TILE_SIZE = Configuration.TileSize;
        const GRID_WIDTH = Math.ceil(UiInterface.TotalWidth / Configuration.TileSize);
        const GRID_HEIGHT = Math.floor(UiInterface.TotalHeight / Configuration.TileSize);

        const canvas = document.getElementById('mapEditorCanvas');
        const ctx = canvas.getContext('2d');
        const tilesetImage = document.getElementById('tileset');
        const toolbar = document.getElementById('toolbar');
        const outputTextarea = document.getElementById('tilesetOutput');
        const copyBtn = document.getElementById('copyBtn');
        const clearBtn = document.getElementById('clearBtn');

        let tileset = tilemap;
        let selectedTile = 0;

        canvas.width = GRID_WIDTH * TILE_SIZE;
        canvas.height = GRID_HEIGHT * TILE_SIZE;

        const tileTypes = [
            { id: 0, name: 'Ground' },
            { id: 1, name: 'Sky' }
        ];

        tileTypes.forEach(tile => {
            if (!tilesetImage) { return; }

            const btn = document.createElement('div');
            btn.className = 'tile-btn';
            btn.title = tile.name;
            btn.dataset.tileId = tile.id;

            btn.style.backgroundImage = `url(${tilesetImage.src})`;
            btn.style.backgroundPosition = `-${tile.id * TILE_SIZE * 2}px 0`;

            btn.addEventListener('click', () => {
                document.querySelectorAll('.tile-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                selectedTile = tile.id;
            });

            toolbar.appendChild(btn);
        });

        document.querySelector('.tile-btn')?.classList.add('selected');

        function drawGrid() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let x = 0; x < GRID_WIDTH; x++) {
                for (let y = 0; y < GRID_HEIGHT; y++) {
                    const tileId = tileset[x][y];
                    const tileX = x * TILE_SIZE;
                    const tileY = y * TILE_SIZE;

                    if (tilesetImage) {
                        ctx.drawImage(
                            tilesetImage,
                            tileId * TILE_SIZE, 0, TILE_SIZE, TILE_SIZE,
                            tileX, tileY, TILE_SIZE, TILE_SIZE
                        );
                    } else {
                        ctx.fillRect(tileX, tileY, TILE_SIZE, TILE_SIZE);
                    }

                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
                    ctx.strokeRect(tileX, tileY, TILE_SIZE, TILE_SIZE);
                }
            }

            updateOutput();
        }

        canvas.addEventListener('click', e => {
            const rect = canvas.getBoundingClientRect();
            const x = Math.floor((e.clientX - rect.left) / TILE_SIZE);
            const y = Math.floor((e.clientY - rect.top) / TILE_SIZE);

            if (x >= 0 && x < GRID_WIDTH && y >= 0 && y < GRID_HEIGHT) {
                tileset[x][y] = selectedTile;
                drawGrid();
            }
        });

        let isDragging = false;
        canvas.addEventListener('mousedown', () => isDragging = true);
        canvas.addEventListener('mouseup', () => isDragging = false);
        canvas.addEventListener('mouseleave', () => isDragging = false);
        canvas.addEventListener('mousemove', e => {
            if (isDragging) {
                const rect = canvas.getBoundingClientRect();
                const x = Math.floor((e.clientX - rect.left) / TILE_SIZE);
                const y = Math.floor((e.clientY - rect.top) / TILE_SIZE);

                if (x >= 0 && x < GRID_WIDTH && y >= 0 && y < GRID_HEIGHT) {
                    tileset[x][y] = selectedTile;
                    drawGrid();
                }
            }
        });

        function updateOutput() {
            const formatted = JSON.stringify(tileset, null, 2)
                .replace(/],/g, '],\n')
                .replace(/\[\[/, '[\n  [')
                .replace(/]]/, ']\n]');

            outputTextarea.value = `// Generated tilemap.js\nexport default ${formatted};`;
        }

        copyBtn.addEventListener('click', () => {
            outputTextarea.select();
            document.execCommand('copy');
            alert('Copied to clipboard!');
        });

        clearBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear the canvas?')) {
                tileset = Array(GRID_WIDTH).fill().map(() => Array(GRID_HEIGHT).fill(1));
                drawGrid();
            }
        });

        drawGrid();
    }
}

export default MapEditor;
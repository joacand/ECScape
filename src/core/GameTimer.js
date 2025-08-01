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
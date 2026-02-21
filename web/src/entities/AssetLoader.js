import { CONFIG } from '../Config.js';

export class AssetLoader {
    constructor() {
        this.cache = new Map();
    }

    /**
     * Pre-renders a neon asset to an offscreen canvas for performance.
     */
    preRender(key, width, height, drawFn) {
        const canvas = document.createElement('canvas');
        canvas.width = width + 40; // Extra room for glow
        canvas.height = height + 40;
        const ctx = canvas.getContext('2d');

        // Offset for glow
        ctx.translate(20, 20);
        drawFn(ctx);

        this.cache.set(key, canvas);
        return canvas;
    }

    get(key) {
        return this.cache.get(key);
    }
}

export const Assets = new AssetLoader();

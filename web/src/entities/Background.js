export class Background {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        // Parallax layers
        this.layers = [
            { color: '#1a1a2e', speedFactor: 0.1, elements: this.generateStars() }, // Distant stars/grid
            { color: '#2b2b4d', speedFactor: 0.3, elements: this.generateBuildings(5, 100, 200) }, // Distant buildings
            { color: '#3d3d70', speedFactor: 0.6, elements: this.generateBuildings(10, 150, 300) }, // Near buildings
        ];

        this.groundY = this.canvas.height - 90;
        this.gridOffset = 0;
    }

    generateStars() {
        const stars = [];
        for (let i = 0; i < 100; i++) {
            stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * (this.canvas.height - 200),
                size: Math.random() * 2
            });
        }
        return stars;
    }

    generateBuildings(count, minH, maxH) {
        const buildings = [];
        let currentX = 0;
        while (currentX < this.canvas.width * 2) {
            const width = 80 + Math.random() * 120;
            const height = minH + Math.random() * (maxH - minH);
            buildings.push({
                x: currentX,
                width: width,
                height: height,
                windows: this.generateWindows(width, height)
            });
            currentX += width + 20;
        }
        return buildings;
    }

    generateWindows(w, h) {
        const windows = [];
        const rows = Math.floor(h / 30);
        const cols = Math.floor(w / 25);
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (Math.random() > 0.6) {
                    windows.push({ x: c * 25 + 10, y: r * 30 + 10 });
                }
            }
        }
        return windows;
    }

    update(gameSpeed) {
        this.layers.forEach(layer => {
            layer.elements.forEach(el => {
                el.x -= gameSpeed * layer.speedFactor;
                // Wrap around
                if (el.x + (el.width || 0) < 0) {
                    el.x = this.canvas.width + Math.random() * 100;
                }
            });
        });

        this.gridOffset = (this.gridOffset + gameSpeed) % 100;
    }

    draw() {
        const ctx = this.ctx;

        // Draw Space/Sky
        const grd = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        grd.addColorStop(0, "#050508");
        grd.addColorStop(1, "#1a1a2e");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw Layers
        this.layers.forEach((layer, index) => {
            ctx.fillStyle = layer.color;
            if (index === 0) { // Stars
                ctx.fillStyle = '#fff';
                layer.elements.forEach(star => {
                    ctx.beginPath();
                    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                    ctx.fill();
                });
            } else { // Buildings
                layer.elements.forEach(b => {
                    ctx.fillStyle = layer.color;
                    ctx.fillRect(b.x, this.canvas.height - 90 - b.height, b.width, b.height);

                    // Draw windows
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                    b.windows.forEach(w => {
                        if (b.x + w.x < this.canvas.width && b.x + w.x > 0) {
                            ctx.fillRect(b.x + w.x, this.canvas.height - 90 - b.height + w.y, 10, 15);
                        }
                    });

                    // Top glow
                    ctx.strokeStyle = index === 1 ? '#00f3ff22' : '#ff00ff22';
                    ctx.beginPath();
                    ctx.moveTo(b.x, this.canvas.height - 90 - b.height);
                    ctx.lineTo(b.x + b.width, this.canvas.height - 90 - b.height);
                    ctx.stroke();
                });
            }
        });

        // Draw Ground Grid (Neon Floor)
        this.drawGrid();
    }

    drawGrid() {
        const ctx = this.ctx;
        const groundY = this.canvas.height - 90;

        ctx.save();
        ctx.strokeStyle = '#9d00ff';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.5;

        // Horizontal lines with perspective
        for (let i = 0; i < 10; i++) {
            const y = groundY + (i * i * 3);
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.canvas.width, y);
            ctx.stroke();
        }

        // Vertical lines
        const centerX = this.canvas.width / 2;
        for (let i = -20; i < 20; i++) {
            const xOffset = i * 100 - (this.gridOffset % 100);
            ctx.beginPath();
            ctx.moveTo(centerX + xOffset * 0.1, groundY);
            ctx.lineTo(centerX + xOffset * 5, this.canvas.height);
            ctx.stroke();
        }

        ctx.restore();
    }
}

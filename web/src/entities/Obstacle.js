export class Obstacle {
    constructor(canvas, gameSpeed) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.type = Math.random() > 0.4 ? 'BARRIER' : 'DRONE';
        this.speed = gameSpeed;

        if (this.type === 'BARRIER') {
            this.width = 30 + Math.random() * 20;
            this.height = 40 + Math.random() * 40;
            this.x = this.canvas.width;
            this.y = this.canvas.height - CONFIG.GROUND_Y_OFFSET - this.height;
            this.color = '#ff00ff';
        } else {
            this.width = 40;
            this.height = 30;
            this.x = this.canvas.width;
            this.y = this.canvas.height - CONFIG.GROUND_Y_OFFSET - 80; // Floating
            this.color = '#ff9d00';
        }

        this.markedForDeletion = false;
    }

    update() {
        this.x -= this.speed;
        if (this.x + this.width < 0) {
            this.markedForDeletion = true;
        }
    }

    draw() {
        const ctx = this.ctx;
        ctx.save();

        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.fillStyle = this.color === '#ff00ff' ? 'rgba(255, 0, 255, 0.2)' : 'rgba(255, 157, 0, 0.2)';

        if (this.type === 'BARRIER') {
            // Draw a glowing electric gate
            ctx.strokeRect(this.x, this.y, this.width, this.height);
            ctx.fillRect(this.x, this.y, this.width, this.height);

            // Electricity effect
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                const ey = this.y + Math.random() * this.height;
                ctx.moveTo(this.x, ey);
                ctx.lineTo(this.x + this.width, ey + (Math.random() - 0.5) * 10);
            }
            ctx.stroke();
        } else {
            // Draw a security drone
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 12, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fill();

            // Probes/Arms
            ctx.moveTo(this.x, this.y + 15);
            ctx.lineTo(this.x + 10, this.y + 15);
            ctx.moveTo(this.x + this.width, this.y + 15);
            ctx.lineTo(this.x + this.width - 10, this.y + 15);
            ctx.stroke();
        }

        ctx.restore();
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

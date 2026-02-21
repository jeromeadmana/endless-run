export class Player {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.width = 40;
        this.height = 60;
        this.baseHeight = 60;
        this.slideHeight = 35;

        this.x = 100;
        this.y = this.canvas.height - 150;
        this.groundY = this.canvas.height - 150;

        this.velocityY = 0;
        this.gravity = 0.8;
        this.jumpForce = -18;

        this.state = 'RUNNING'; // RUNNING, JUMPING, SLIDING, CRASHED
        this.animationFrame = 0;

        this.glowColor = '#00f3ff';
        this.particles = [];
    }

    update() {
        if (this.state === 'CRASHED') return;

        // Apply gravity
        if (this.y < this.groundY || this.velocityY < 0) {
            this.velocityY += this.gravity;
            this.y += this.velocityY;

            if (this.y > this.groundY) {
                this.y = this.groundY;
                this.velocityY = 0;
                if (this.state === 'JUMPING') {
                    this.state = 'RUNNING';
                }
            }
        }

        // Animation frames
        this.animationFrame += 0.15;

        // Handle particles
        if (this.state !== 'JUMPING' && Math.random() > 0.5) {
            this.particles.push({
                x: this.x + 10,
                y: this.y + this.height - 5,
                vx: -Math.random() * 2 - 1,
                vy: -Math.random() * 1,
                size: Math.random() * 4,
                life: 1.0
            });
        }

        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.02;
        });
        this.particles = this.particles.filter(p => p.life > 0);
    }

    jump() {
        if (this.state === 'RUNNING' || this.state === 'SLIDING') {
            this.state = 'JUMPING';
            this.velocityY = this.jumpForce;
            this.height = this.baseHeight;
            // Burst particles
            for (let i = 0; i < 10; i++) {
                this.particles.push({
                    x: this.x + 20,
                    y: this.y + this.height,
                    vx: (Math.random() - 0.5) * 5,
                    vy: Math.random() * 2,
                    size: Math.random() * 5,
                    life: 1.0
                });
            }
        }
    }

    slide(active) {
        if (active && this.state === 'RUNNING') {
            this.state = 'SLIDING';
            this.height = this.slideHeight;
        } else if (!active && this.state === 'SLIDING') {
            this.state = 'RUNNING';
            this.height = this.baseHeight;
        }
    }

    draw() {
        const ctx = this.ctx;

        // Draw particles
        this.particles.forEach(p => {
            ctx.fillStyle = `rgba(0, 243, 255, ${p.life})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.save();

        // Set glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.glowColor;
        ctx.strokeStyle = this.glowColor;
        ctx.lineWidth = 3;
        ctx.fillStyle = 'rgba(0, 243, 255, 0.2)';

        // Dynamic Y adjustment for size change while sliding
        const drawY = this.state === 'SLIDING' ? this.y + (this.baseHeight - this.slideHeight) : this.y;

        // Draw stylized runner shape
        ctx.beginPath();
        if (this.state === 'SLIDING') {
            // Rounded rectangle for sliding
            this.roundRect(ctx, this.x, drawY, this.width + 10, this.height, 5);
        } else {
            // Humanoid-ish silhouette for running/jumping
            // We'll use simple geometric parts to keep it "vector/blueprint" style

            // Head
            ctx.arc(this.x + 20, drawY - 10 + (Math.sin(this.animationFrame) * 2), 8, 0, Math.PI * 2);

            // Body
            ctx.moveTo(this.x + 10, drawY);
            ctx.lineTo(this.x + 30, drawY);
            ctx.lineTo(this.x + 25, drawY + this.height);
            ctx.lineTo(this.x + 5, drawY + this.height);
            ctx.closePath();
        }

        ctx.fill();
        ctx.stroke();

        // Accent lines for motion
        if (this.state === 'RUNNING') {
            ctx.beginPath();
            ctx.moveTo(this.x - 10, drawY + 20);
            ctx.lineTo(this.x - 5, drawY + 20);
            ctx.stroke();
        }

        ctx.restore();
    }

    roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    getBounds() {
        const drawY = this.state === 'SLIDING' ? this.y + (this.baseHeight - this.slideHeight) : this.y;
        return {
            x: this.x,
            y: drawY,
            width: this.width,
            height: this.height
        };
    }
}

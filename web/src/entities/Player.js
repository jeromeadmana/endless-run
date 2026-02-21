import { CONFIG } from '../Config.js';
import { Assets } from './AssetLoader.js';

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
        this.gravity = CONFIG.GRAVITY;
        this.jumpForce = CONFIG.JUMP_FORCE;

        this.state = 'RUNNING';
        this.animationFrame = 0;
        this.particles = [];

        this.initAssets();
    }

    initAssets() {
        Assets.preRender('player_run', this.width, this.height, (ctx) => {
            ctx.shadowBlur = 15;
            ctx.shadowColor = CONFIG.COLORS.CYAN;
            ctx.strokeStyle = CONFIG.COLORS.CYAN;
            ctx.lineWidth = 3;
            ctx.fillStyle = 'rgba(0, 243, 255, 0.2)';

            // Body
            ctx.beginPath();
            ctx.moveTo(10, 0);
            ctx.lineTo(30, 0);
            ctx.lineTo(25, 60);
            ctx.lineTo(5, 60);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        });

        Assets.preRender('player_slide', this.width + 10, this.slideHeight, (ctx) => {
            ctx.shadowBlur = 15;
            ctx.shadowColor = CONFIG.COLORS.CYAN;
            ctx.strokeStyle = CONFIG.COLORS.CYAN;
            ctx.lineWidth = 3;
            ctx.fillStyle = 'rgba(0, 243, 255, 0.2)';

            // Rounded rect
            const r = 5;
            const w = this.width + 10;
            const h = this.slideHeight;
            ctx.beginPath();
            ctx.moveTo(r, 0);
            ctx.lineTo(w - r, 0);
            ctx.quadraticCurveTo(w, 0, w, r);
            ctx.lineTo(w, h - r);
            ctx.quadraticCurveTo(w, h, w - r, h);
            ctx.lineTo(r, h);
            ctx.quadraticCurveTo(0, h, 0, h - r);
            ctx.lineTo(0, r);
            ctx.quadraticCurveTo(0, 0, r, 0);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        });
    }

    update() {
        if (this.state === 'CRASHED') return;

        if (this.y < this.groundY || this.velocityY < 0) {
            this.velocityY += this.gravity;
            this.y += this.velocityY;

            if (this.y > this.groundY) {
                this.y = this.groundY;
                this.velocityY = 0;
                if (this.state === 'JUMPING') this.state = 'RUNNING';
            }
        }

        this.animationFrame += 0.15;

        // Particles
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
            for (let i = 0; i < 10; i++) {
                this.particles.push({
                    x: this.x + 20, y: this.y + this.height,
                    vx: (Math.random() - 0.5) * 5, vy: Math.random() * 2,
                    size: Math.random() * 5, life: 1.0
                });
            }
        }
    }

    cancelJump() {
        // If we are moving up, cut the velocity to make the jump shorter
        if (this.state === 'JUMPING' && this.velocityY < -5) {
            this.velocityY = -5;
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

        this.particles.forEach(p => {
            ctx.fillStyle = `rgba(0, 243, 255, ${p.life})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });

        const drawY = this.state === 'SLIDING' ? this.y + (this.baseHeight - this.slideHeight) : this.y;
        const asset = this.state === 'SLIDING' ? Assets.get('player_slide') : Assets.get('player_run');

        if (asset) {
            // Asset is 40px larger than actual (for glow padding)
            ctx.drawImage(asset, this.x - 20, drawY - 20);
        }

        // Animated head (draw in real time for float effect)
        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = CONFIG.COLORS.CYAN;
        ctx.strokeStyle = CONFIG.COLORS.CYAN;
        ctx.lineWidth = 2;
        if (this.state !== 'SLIDING') {
            ctx.beginPath();
            ctx.arc(this.x + 20, drawY - 10 + (Math.sin(this.animationFrame) * 2), 8, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.restore();
    }

    getBounds() {
        const drawY = this.state === 'SLIDING' ? this.y + (this.baseHeight - this.slideHeight) : this.y;
        return { x: this.x, y: drawY, width: this.width, height: this.height };
    }
}

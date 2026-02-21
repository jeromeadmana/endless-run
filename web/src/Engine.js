import { Player } from './entities/Player.js';
import { Obstacle } from './entities/Obstacle.js';
import { Background } from './entities/Background.js';

export class Engine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.player = new Player(canvas);
        this.background = new Background(canvas);
        this.obstacles = [];

        this.gameSpeed = 7;
        this.score = 0;
        this.highScore = localStorage.getItem('neon-velocity-best') || 0;
        this.gameState = 'START'; // START, RUNNING, GAME_OVER

        this.lastTime = 0;
        this.obstacleTimer = 0;
        this.obstacleInterval = 1500;
    }

    start() {
        this.gameState = 'RUNNING';
        this.score = 0;
        this.gameSpeed = 7;
        this.obstacles = [];
        this.player = new Player(this.canvas);

        document.getElementById('start-screen').classList.remove('active');
        document.getElementById('game-over-screen').classList.remove('active');
        document.getElementById('hud').classList.add('active');
    }

    gameOver() {
        this.gameState = 'GAME_OVER';
        if (this.score > this.highScore) {
            this.highScore = Math.floor(this.score);
            localStorage.setItem('neon-velocity-best', this.highScore);
        }

        document.getElementById('game-over-screen').classList.add('active');
        document.getElementById('final-score').innerText = Math.floor(this.score);
        document.getElementById('high-score').innerText = this.highScore + 'm';
    }

    update(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        if (this.gameState === 'RUNNING') {
            this.score += deltaTime * 0.01;
            this.gameSpeed += 0.001; // Increase difficulty

            this.background.update(this.gameSpeed);
            this.player.update();

            // Handle Obstacles
            this.obstacleTimer += deltaTime;
            if (this.obstacleTimer > this.obstacleInterval) {
                this.obstacles.push(new Obstacle(this.canvas, this.gameSpeed));
                this.obstacleTimer = 0;
                this.obstacleInterval = Math.max(800, 1500 - (this.gameSpeed * 50));
            }

            this.obstacles.forEach(obs => {
                obs.update();
                if (this.checkCollision(this.player, obs)) {
                    this.gameOver();
                }
            });

            this.obstacles = this.obstacles.filter(obs => !obs.markedForDeletion);

            // Update UI
            document.getElementById('score').innerText = Math.floor(this.score) + 'm';
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.background.draw();

        if (this.gameState !== 'START') {
            this.player.draw();
            this.obstacles.forEach(obs => obs.draw());
        }
    }

    checkCollision(player, obs) {
        const p = player.getBounds();
        const o = obs.getBounds();

        // Add small margin for better feel (forgiving hitbox)
        const margin = 10;

        return (
            p.x + margin < o.x + o.width &&
            p.x + p.width - margin > o.x &&
            p.y + margin < o.y + o.height &&
            p.y + p.height - margin > o.y
        );
    }

    handleInput(type, key) {
        if (this.gameState === 'RUNNING') {
            if (type === 'keydown') {
                if (key === ' ' || key === 'ArrowUp') this.player.jump();
                if (key === 's' || key === 'ArrowDown') this.player.slide(true);
            } else if (type === 'keyup') {
                if (key === 's' || key === 'ArrowDown') this.player.slide(false);
            }
        }
    }
}

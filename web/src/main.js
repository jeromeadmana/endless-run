import './style.css'
import { Engine } from './Engine.js'

const canvas = document.getElementById('game-canvas');
const engine = new Engine(canvas);

// Responsive canvas
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  // Re-init background elements for new size
  if (engine.background) {
    engine.background.groundY = canvas.height - 90;
  }
  if (engine.player) {
    engine.player.updateSize();
  }
}

window.addEventListener('resize', resize);
resize();

// Input listeners
window.addEventListener('keydown', (e) => {
  if ([' ', 'ArrowUp', 'ArrowDown', 's'].includes(e.key)) {
    e.preventDefault();
  }
  engine.handleInput('keydown', e.key);
});

window.addEventListener('keyup', (e) => engine.handleInput('keyup', e.key));

// Mobile Touch Support
window.addEventListener('touchstart', (e) => {
  const touchY = e.touches[0].clientY;
  if (touchY < window.innerHeight / 2) {
    engine.handleInput('keydown', ' '); // Top half jumps
  } else {
    engine.handleInput('keydown', 's'); // Bottom half slides
  }
});

window.addEventListener('touchend', () => {
  engine.handleInput('keyup', 's');
});

// UI Buttons
let selectedDifficulty = 'EASY';

document.querySelectorAll('.diff-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    selectedDifficulty = e.target.dataset.difficulty;
  });
});

document.getElementById('start-btn').addEventListener('click', (e) => {
  e.target.blur();
  engine.start(selectedDifficulty);
});

document.getElementById('restart-btn').addEventListener('click', (e) => {
  e.target.blur();
  engine.start(selectedDifficulty);
});

// Game Loop
function tick(timestamp) {
  engine.update(timestamp);
  engine.draw();
  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);

// High score init
document.getElementById('high-score').innerText = (localStorage.getItem('neon-velocity-best') || 0) + 'm';

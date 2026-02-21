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

// UI Buttons
document.getElementById('start-btn').addEventListener('click', (e) => {
  e.target.blur();
  engine.start();
});

document.getElementById('restart-btn').addEventListener('click', (e) => {
  e.target.blur();
  engine.start();
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

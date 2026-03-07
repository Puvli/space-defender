import { Input } from './input.js';
import { Starfield } from './stars.js';
import { Player } from './player.js';
import { EnemySpawner } from './enemies.js';
import { createExplosion } from './particles.js';
import { TouchControls } from './touch.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const WIDTH = 480;
const HEIGHT = 640;
canvas.width = WIDTH;
canvas.height = HEIGHT;

// Scale canvas to fit screen
function resize() {
  const scale = Math.min(window.innerWidth / WIDTH, window.innerHeight / HEIGHT);
  canvas.style.width = `${WIDTH * scale}px`;
  canvas.style.height = `${HEIGHT * scale}px`;
}
resize();
window.addEventListener('resize', resize);

// Game state
const input = new Input();
const touch = new TouchControls(canvas);
const starfield = new Starfield(WIDTH, HEIGHT);
let state = 'start'; // start | playing | gameover
let player;
let enemies;
let playerBullets;
let enemyBullets;
let particles;
let spawner;
let score;
let highScore = parseInt(localStorage.getItem('spaceDefenderHigh') || '0', 10);

function initGame() {
  player = new Player(WIDTH / 2 - 20, HEIGHT - 80);
  enemies = [];
  playerBullets = [];
  enemyBullets = [];
  particles = [];
  spawner = new EnemySpawner(WIDTH);
  score = 0;
}

// Collision detection (AABB)
function collides(a, b) {
  return a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;
}

function update(dt) {
  starfield.update(dt);

  if (state === 'start') {
    if (input.isPressed('Space') || input.isPressed('Enter') || touch.shooting) {
      initGame();
      state = 'playing';
    }
    return;
  }

  if (state === 'gameover') {
    if (input.isPressed('Space') || input.isPressed('Enter') || touch.shooting) {
      state = 'start';
    }
    // Still update particles
    particles = particles.filter(p => { p.update(dt); return p.alive; });
    return;
  }

  // Playing state
  player.update(dt, input, { width: WIDTH, height: HEIGHT }, touch);

  // Player shooting
  if (player.canShoot(input, touch)) {
    playerBullets.push(player.shoot());
  }

  // Update bullets
  playerBullets.forEach(b => b.y += b.vy * dt);
  enemyBullets.forEach(b => b.y += b.vy * dt);
  playerBullets = playerBullets.filter(b => b.y > -20);
  enemyBullets = enemyBullets.filter(b => b.y < HEIGHT + 20);

  // Spawn enemies
  spawner.update(dt, score);
  if (spawner.shouldSpawn()) {
    enemies.push(spawner.spawn());
  }

  // Update enemies
  for (const enemy of enemies) {
    enemy.update(dt);
    if (enemy.canShoot()) {
      enemyBullets.push(enemy.shoot());
    }
  }
  enemies = enemies.filter(e => e.y < HEIGHT + 60);

  // Player bullets vs enemies
  for (let i = playerBullets.length - 1; i >= 0; i--) {
    const bullet = playerBullets[i];
    for (let j = enemies.length - 1; j >= 0; j--) {
      const enemy = enemies[j];
      if (collides(bullet, enemy)) {
        playerBullets.splice(i, 1);
        enemy.hp--;
        particles.push(...createExplosion(
          bullet.x + bullet.width / 2,
          bullet.y,
          '#ffcc02',
          4
        ));
        if (enemy.hp <= 0) {
          score += enemy.points;
          particles.push(...createExplosion(
            enemy.x + enemy.width / 2,
            enemy.y + enemy.height / 2,
            enemy.type === 'big' ? '#ef5350' : '#ffa726',
            20
          ));
          enemies.splice(j, 1);
        }
        break;
      }
    }
  }

  // Enemy bullets vs player
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    if (collides(enemyBullets[i], player)) {
      particles.push(...createExplosion(
        enemyBullets[i].x,
        enemyBullets[i].y,
        '#4fc3f7',
        8
      ));
      enemyBullets.splice(i, 1);
      player.hit();
      if (player.lives <= 0) {
        particles.push(...createExplosion(
          player.x + player.width / 2,
          player.y + player.height / 2,
          '#4fc3f7',
          30
        ));
        if (score > highScore) {
          highScore = score;
          localStorage.setItem('spaceDefenderHigh', String(highScore));
        }
        state = 'gameover';
      }
    }
  }

  // Enemies vs player (collision)
  for (let i = enemies.length - 1; i >= 0; i--) {
    if (collides(enemies[i], player)) {
      const enemy = enemies[i];
      particles.push(...createExplosion(
        enemy.x + enemy.width / 2,
        enemy.y + enemy.height / 2,
        '#ffa726',
        15
      ));
      enemies.splice(i, 1);
      player.hit();
      if (player.lives <= 0) {
        particles.push(...createExplosion(
          player.x + player.width / 2,
          player.y + player.height / 2,
          '#4fc3f7',
          30
        ));
        if (score > highScore) {
          highScore = score;
          localStorage.setItem('spaceDefenderHigh', String(highScore));
        }
        state = 'gameover';
      }
    }
  }

  // Update particles
  particles = particles.filter(p => { p.update(dt); return p.alive; });
}

function drawBullets(ctx, bullets, color) {
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 6;
  for (const b of bullets) {
    ctx.fillRect(b.x, b.y, b.width, b.height);
  }
  ctx.shadowBlur = 0;
}

function drawHUD(ctx) {
  ctx.fillStyle = '#fff';
  ctx.font = '16px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`SCORE: ${score}`, 12, 28);

  ctx.textAlign = 'right';
  ctx.fillText(`HI: ${highScore}`, WIDTH - 12, 28);

  // Lives
  ctx.textAlign = 'left';
  for (let i = 0; i < player.lives; i++) {
    ctx.fillStyle = '#4fc3f7';
    ctx.beginPath();
    ctx.moveTo(12 + i * 22 + 7, 42);
    ctx.lineTo(12 + i * 22, 54);
    ctx.lineTo(12 + i * 22 + 14, 54);
    ctx.closePath();
    ctx.fill();
  }
}

function drawScreen(title, subtitle) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = '#4fc3f7';
  ctx.font = 'bold 36px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(title, WIDTH / 2, HEIGHT / 2 - 30);

  ctx.fillStyle = '#aaa';
  ctx.font = '16px monospace';
  ctx.fillText(subtitle, WIDTH / 2, HEIGHT / 2 + 20);
}

function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Background
  ctx.fillStyle = '#0a0a1a';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  starfield.draw(ctx);

  if (state === 'start') {
    drawScreen('SPACE DEFENDER', 'Press SPACE to start');

    ctx.fillStyle = '#666';
    ctx.font = '12px monospace';
    const isMobile = 'ontouchstart' in window;
    ctx.fillText(isMobile ? 'Left = Move | Right = Shoot' : 'WASD / Arrows = Move | Space = Shoot', WIDTH / 2, HEIGHT / 2 + 60);

    if (highScore > 0) {
      ctx.fillStyle = '#ffa726';
      ctx.fillText(`High Score: ${highScore}`, WIDTH / 2, HEIGHT / 2 + 90);
    }
    return;
  }

  // Draw game objects
  for (const e of enemies) e.draw(ctx);
  player.draw(ctx);
  drawBullets(ctx, playerBullets, '#4fc3f7');
  drawBullets(ctx, enemyBullets, '#ef5350');
  for (const p of particles) p.draw(ctx);
  drawHUD(ctx);

  // Touch controls overlay
  if (state === 'playing') touch.draw(ctx);

  if (state === 'gameover') {
    drawScreen('GAME OVER', `Score: ${score} | Press SPACE to restart`);
  }
}

// Game loop with fixed timestep
let lastTime = 0;

function loop(timestamp) {
  const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
  lastTime = timestamp;

  update(dt);
  draw();

  requestAnimationFrame(loop);
}

requestAnimationFrame((ts) => {
  lastTime = ts;
  loop(ts);
});

export class Enemy {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.hp = type === 'big' ? 3 : 1;
    this.points = type === 'big' ? 30 : 10;
    this.width = type === 'big' ? 44 : 30;
    this.height = type === 'big' ? 44 : 30;
    this.speed = type === 'big' ? 80 : 120 + Math.random() * 60;
    this.phase = Math.random() * Math.PI * 2;
    this.amplitude = 30 + Math.random() * 40;
    this.shootTimer = 1 + Math.random() * 3;
    this.baseX = x;
  }

  update(dt) {
    this.y += this.speed * dt;
    this.phase += dt * 2;
    this.x = this.baseX + Math.sin(this.phase) * this.amplitude;
    this.shootTimer -= dt;
  }

  canShoot() {
    if (this.shootTimer <= 0) {
      this.shootTimer = 2 + Math.random() * 3;
      return true;
    }
    return false;
  }

  shoot() {
    return {
      x: this.x + this.width / 2 - 2,
      y: this.y + this.height,
      width: 4,
      height: 10,
      vy: 250,
    };
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

    if (this.type === 'big') {
      // Big enemy — hexagonal shape
      ctx.fillStyle = '#ef5350';
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 2;
        const r = this.width / 2;
        const px = Math.cos(angle) * r;
        const py = Math.sin(angle) * r;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#c62828';
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Small enemy — diamond
      ctx.fillStyle = '#ffa726';
      ctx.beginPath();
      ctx.moveTo(0, -this.height / 2);
      ctx.lineTo(this.width / 2, 0);
      ctx.lineTo(0, this.height / 2);
      ctx.lineTo(-this.width / 2, 0);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#e65100';
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

export class EnemySpawner {
  constructor(width) {
    this.width = width;
    this.timer = 0;
    this.interval = 1.5;
    this.wave = 0;
  }

  update(dt, score) {
    this.timer -= dt;
    // Speed up spawns as score increases
    this.interval = Math.max(0.4, 1.5 - score / 500);
  }

  shouldSpawn() {
    if (this.timer <= 0) {
      this.timer = this.interval;
      return true;
    }
    return false;
  }

  spawn() {
    const margin = 50;
    const x = margin + Math.random() * (this.width - margin * 2);
    const type = Math.random() < 0.2 ? 'big' : 'small';
    return new Enemy(x, -50, type);
  }
}

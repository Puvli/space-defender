export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    this.speed = 300;
    this.shootCooldown = 0;
    this.shootRate = 0.18;
    this.lives = 3;
    this.invincible = 0;
  }

  update(dt, input, bounds, touch) {
    // Keyboard
    if (input.isPressed('ArrowLeft') || input.isPressed('KeyA')) {
      this.x -= this.speed * dt;
    }
    if (input.isPressed('ArrowRight') || input.isPressed('KeyD')) {
      this.x += this.speed * dt;
    }
    if (input.isPressed('ArrowUp') || input.isPressed('KeyW')) {
      this.y -= this.speed * dt;
    }
    if (input.isPressed('ArrowDown') || input.isPressed('KeyS')) {
      this.y += this.speed * dt;
    }

    // Touch joystick
    if (touch && touch.active) {
      this.x += touch.moveX * this.speed * dt;
      this.y += touch.moveY * this.speed * dt;
    }

    this.x = Math.max(0, Math.min(bounds.width - this.width, this.x));
    this.y = Math.max(0, Math.min(bounds.height - this.height, this.y));

    if (this.shootCooldown > 0) this.shootCooldown -= dt;
    if (this.invincible > 0) this.invincible -= dt;
  }

  canShoot(input, touch) {
    const pressed = input.isPressed('Space') || input.isPressed('KeyJ') || (touch && touch.shooting);
    return pressed && this.shootCooldown <= 0;
  }

  shoot() {
    this.shootCooldown = this.shootRate;
    return {
      x: this.x + this.width / 2 - 2,
      y: this.y,
      width: 4,
      height: 12,
      vy: -500,
    };
  }

  hit() {
    if (this.invincible > 0) return false;
    this.lives--;
    this.invincible = 2;
    return true;
  }

  draw(ctx) {
    if (this.invincible > 0 && Math.floor(this.invincible * 10) % 2 === 0) return;

    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

    // Ship body
    ctx.fillStyle = '#4fc3f7';
    ctx.beginPath();
    ctx.moveTo(0, -this.height / 2);
    ctx.lineTo(-this.width / 2, this.height / 2);
    ctx.lineTo(-this.width / 4, this.height / 3);
    ctx.lineTo(this.width / 4, this.height / 3);
    ctx.lineTo(this.width / 2, this.height / 2);
    ctx.closePath();
    ctx.fill();

    // Cockpit
    ctx.fillStyle = '#e0f7fa';
    ctx.beginPath();
    ctx.ellipse(0, -2, 5, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Engine glow
    ctx.fillStyle = '#ff7043';
    ctx.beginPath();
    ctx.ellipse(0, this.height / 3 + 3, 6, 4 + Math.random() * 3, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

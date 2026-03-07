export class Starfield {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.layers = [
      this.createLayer(40, 0.3, 1),
      this.createLayer(25, 0.7, 1.5),
      this.createLayer(15, 1.2, 2),
    ];
  }

  createLayer(count, speed, size) {
    const stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        speed,
        size,
      });
    }
    return stars;
  }

  update(dt) {
    for (const layer of this.layers) {
      for (const star of layer) {
        star.y += star.speed * dt * 60;
        if (star.y > this.height) {
          star.y = 0;
          star.x = Math.random() * this.width;
        }
      }
    }
  }

  draw(ctx) {
    for (const layer of this.layers) {
      for (const star of layer) {
        ctx.globalAlpha = 0.3 + star.size * 0.2;
        ctx.fillStyle = '#fff';
        ctx.fillRect(star.x, star.y, star.size, star.size);
      }
    }
    ctx.globalAlpha = 1;
  }
}

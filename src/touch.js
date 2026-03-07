export class TouchControls {
  constructor(canvas) {
    this.canvas = canvas;
    this.active = false;
    this.moveX = 0; // -1 to 1
    this.moveY = 0; // -1 to 1
    this.shooting = false;

    // Joystick state
    this.joystickId = null;
    this.joystickOrigin = null;
    this.joystickPos = null;
    this.joystickRadius = 50;

    // Shoot button state
    this.shootId = null;

    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);

    canvas.addEventListener('touchstart', this.onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', this.onTouchMove, { passive: false });
    canvas.addEventListener('touchend', this.onTouchEnd, { passive: false });
    canvas.addEventListener('touchcancel', this.onTouchEnd, { passive: false });
  }

  getCanvasPos(touch) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    return {
      x: (touch.clientX - rect.left) * scaleX,
      y: (touch.clientY - rect.top) * scaleY,
    };
  }

  onTouchStart(e) {
    e.preventDefault();
    this.active = true;

    for (const touch of e.changedTouches) {
      const pos = this.getCanvasPos(touch);
      const halfW = this.canvas.width / 2;

      if (pos.x < halfW && this.joystickId === null) {
        // Left side — joystick
        this.joystickId = touch.identifier;
        this.joystickOrigin = pos;
        this.joystickPos = pos;
      } else if (pos.x >= halfW && this.shootId === null) {
        // Right side — shoot
        this.shootId = touch.identifier;
        this.shooting = true;
      }
    }
  }

  onTouchMove(e) {
    e.preventDefault();

    for (const touch of e.changedTouches) {
      if (touch.identifier === this.joystickId) {
        const pos = this.getCanvasPos(touch);
        this.joystickPos = pos;

        const dx = pos.x - this.joystickOrigin.x;
        const dy = pos.y - this.joystickOrigin.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = this.joystickRadius;

        if (dist > 0) {
          const clamped = Math.min(dist, maxDist);
          this.moveX = (dx / dist) * (clamped / maxDist);
          this.moveY = (dy / dist) * (clamped / maxDist);
        }
      }
    }
  }

  onTouchEnd(e) {
    e.preventDefault();

    for (const touch of e.changedTouches) {
      if (touch.identifier === this.joystickId) {
        this.joystickId = null;
        this.joystickOrigin = null;
        this.joystickPos = null;
        this.moveX = 0;
        this.moveY = 0;
      }
      if (touch.identifier === this.shootId) {
        this.shootId = null;
        this.shooting = false;
      }
    }
  }

  draw(ctx) {
    if (!this.active) return;

    // Draw joystick
    if (this.joystickOrigin) {
      // Outer ring
      ctx.globalAlpha = 0.2;
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(this.joystickOrigin.x, this.joystickOrigin.y, this.joystickRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Inner knob
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = '#4fc3f7';
      ctx.beginPath();
      ctx.arc(this.joystickPos.x, this.joystickPos.y, 18, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw shoot button hint
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = '#ef5350';
    const btnX = this.canvas.width - 70;
    const btnY = this.canvas.height - 100;
    ctx.beginPath();
    ctx.arc(btnX, btnY, 35, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 0.5;
    ctx.fillStyle = '#fff';
    ctx.font = '14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('FIRE', btnX, btnY + 5);

    ctx.globalAlpha = 1;
  }
}

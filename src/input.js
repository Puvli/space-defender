export class Input {
  constructor() {
    this.keys = new Set();
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  onKeyDown(e) {
    this.keys.add(e.code);
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
      e.preventDefault();
    }
  }

  onKeyUp(e) {
    this.keys.delete(e.code);
  }

  isPressed(code) {
    return this.keys.has(code);
  }
}

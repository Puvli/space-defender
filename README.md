# Space Defender - HTML5 Canvas Game

A space shooter game built with vanilla JavaScript and HTML5 Canvas API. No frameworks, no runtime dependencies.

## Play

```bash
npm install
npm run dev
```

Open http://localhost:5173 in a browser. Works on desktop and mobile.

## Controls

### Desktop
| Key | Action |
|-----|--------|
| WASD / Arrow Keys | Move ship |
| Space | Shoot |

### Mobile (touch)
| Touch | Action |
|-------|--------|
| Left side of screen | Virtual joystick (drag to move) |
| Right side of screen | Shoot (hold for continuous fire) |

## Features

- Pure Canvas 2D rendering, no game libraries
- 60 FPS game loop with fixed timestep (`requestAnimationFrame`)
- AABB collision detection
- Parallax starfield background (3 layers)
- Two enemy types (small diamond + big hexagon) with sinusoidal movement
- Enemy shooting AI with randomized intervals
- Particle explosion effects on hit/destroy
- Score system with `localStorage` high score persistence
- Progressive difficulty (spawn rate scales with score)
- Start screen, HUD (score, high score, lives), and game over screen
- Mobile support: virtual joystick + fire button via touch events

## Architecture

```
space-defender/
├── index.html          # Entry point
├── package.json        # Vite dev server
└── src/
    ├── main.js         # Game loop, collision, rendering, UI
    ├── input.js        # Keyboard input handler
    ├── touch.js        # Touch controls (virtual joystick + fire)
    ├── player.js       # Player ship entity
    ├── enemies.js      # Enemy types + wave spawner
    ├── particles.js    # Particle explosion system
    └── stars.js        # Parallax starfield
```

## Tech

- Vanilla JavaScript (ES Modules)
- HTML5 Canvas 2D API
- Vite (dev server + build)
- Zero runtime dependencies
- Deployable to GitHub Pages via `vite build`

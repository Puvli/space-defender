# Space Defender

A space shooter game built with vanilla JavaScript and HTML5 Canvas API. No frameworks, no runtime dependencies.

## Play

https://puvli.github.io/space-defender/

## Controls

### Desktop
| Key | Action |
|-----|--------|
| WASD / Arrow Keys | Move ship |
| Space | Shoot |

### Mobile
| Touch | Action |
|-------|--------|
| Left side of screen | Virtual joystick (drag to move) |
| Right side of screen | Shoot (hold for continuous fire) |

## Features

- Pure Canvas 2D rendering, no game libraries
- 60 FPS game loop with `requestAnimationFrame`
- AABB collision detection
- Parallax starfield background (3 layers)
- Two enemy types with sinusoidal movement patterns
- Enemy shooting AI with randomized intervals
- Particle explosion effects
- Score system with `localStorage` high score persistence
- Progressive difficulty scaling
- Mobile support via touch events

## Architecture

```
src/
├── main.js         # Game loop, collision, rendering, UI
├── input.js        # Keyboard input handler
├── touch.js        # Touch controls (virtual joystick + fire)
├── player.js       # Player ship entity
├── enemies.js      # Enemy types + wave spawner
├── particles.js    # Particle explosion system
└── stars.js        # Parallax starfield
```

## Tech Stack

- Vanilla JavaScript (ES Modules)
- HTML5 Canvas 2D API
- Vite (dev server + build)
- GitHub Pages (deployment)

## Local Development

```bash
npm install
npm run dev
```

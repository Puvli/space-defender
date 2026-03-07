# Space Defender - HTML5 Canvas Game

A space shooter game built with vanilla JavaScript and HTML5 Canvas API. No frameworks, no dependencies.

## Play

Open `index.html` in a browser. That's it.

Or play the deployed version on GitHub Pages.

## Controls

| Key | Action |
|-----|--------|
| WASD / Arrow Keys | Move ship |
| Space | Shoot |

## Features

- Pure Canvas 2D rendering, no libraries
- 60 FPS game loop with fixed timestep
- AABB collision detection
- Parallax starfield background (3 layers)
- Two enemy types (small + big) with sinusoidal movement
- Enemy shooting AI
- Particle explosion effects
- Score system with localStorage high score
- Progressive difficulty (spawn rate scales with score)
- Start screen, HUD, and game over screen

## Architecture

```
space-defender/
├── index.html          # Entry point
├── style.css           # Minimal styles
└── src/
    ├── main.js         # Game loop, collision, UI
    ├── input.js        # Keyboard input handler
    ├── player.js       # Player ship entity
    ├── enemies.js      # Enemy + spawner
    ├── particles.js    # Particle effects
    └── stars.js        # Parallax starfield
```

## Tech

- Vanilla JavaScript (ES Modules)
- HTML5 Canvas 2D API
- No build tools, no dependencies
- Deployable to GitHub Pages as-is

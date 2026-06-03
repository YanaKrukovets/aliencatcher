# AlifallX: Don't Leave Them Behind — Claude Code Guide

## Project Overview
Space arcade game built with **Next.js 13 + Tailwind CSS**. Players control a spaceship on an HTML5 canvas, dodge rocks, and catch/destroy aliens. The site also has a landing page with About, Contact, and game info sections.

Completed features: multiple levels with dynamic difficulty scaling (speed, spawn rates, color palettes per level), level-up banner/animation, countdown timer at game start, coin economy (earn/buy bullets/shields/lives), meteor storm hazard with safe zones, UFO with tractor beam, gravity well, scramble control-flip, boss rocks, HeartAlien (+1 life), ShieldAlien (+1 shield), ReverseAlien (shoot for coins), The Last Egg win condition, full mobile support (touch controls, fixed-timestep loop, responsive ship/rock sizing).

Planned future features: multiplayer (2+ players on same device or online), power-ups and upgrades, leaderboard.

## Tech Stack
- **Framework**: Next.js 13 (Pages Router)
- **Styling**: Tailwind CSS + SCSS (`styles/`)
- **i18n**: Custom locale files (`locales/en.js`, `locales/fr.js`)
- **Animation**: Framer Motion
- **Game engine**: Plain HTML5 Canvas (no game library)
- **Forms**: Formspree
- **Dev server**: `yarn dev` → http://localhost:3000

## Key Files
| File | Purpose |
|------|---------|
| `pages/game.js` | Full canvas game loop — ship, aliens, rocks, particles, scoring, levels |
| `pages/index.js` | Landing page |
| `pages/404.js` | Custom 404 page |
| `pages/500.js` | Custom 500 page |
| `components/Header.js` | Site header |
| `components/Navbar.js` | Navigation bar with language toggle |
| `components/NavLangToggle.js` | Language switcher (EN/FR) |
| `components/HomeBanner.js` | Hero section |
| `components/AboutGame.js` | Game description section |
| `components/About.js` | About section |
| `components/Contact.js` | Contact form (Formspree) |
| `components/Footer.js` | Site footer |
| `components/Layout.js` | Page layout wrapper |
| `components/BackToTopButton.js` | Scroll-to-top button |
| `components/Starfield.js` | Animated star background for landing page |
| `locales/en.js` | English strings |
| `locales/fr.js` | French strings |
| `styles/` | SCSS per-component and per-page stylesheets |

## Architecture Notes
- `pages/game.js` uses a single large `useEffect` containing the full game loop — keep game state in `let` vars inside the effect, React state only for UI overlay (score, lives, level, game-over screen).
- Level progression: level 1 while score < 3, then `Math.floor((score - 3) / 5) + 2` — so L2 at 3 pts, new level every 5 pts after that. Each level increases alien/rock speed (`+0.2/level`), tightens spawn intervals (min 55ms at high levels), and cycles color palettes (`LEVEL_PALETTES`/`LEVEL_COLORS`).
- Multi-alien spawns activate at level 2+ via `multiChance`; speed variance adds at level 5+; boss rocks at level 10+.
- Special entities: UFO (level 20+, 15 HP, abducts aliens), ReverseAlien (level 17+, rises from bottom), HeartAlien/ShieldAlien (bonus drops on rocks), GravityWell (level 35+), Scramble (level 37+), LastEgg (level 50, win condition).
- Controls: `← →` / `A` / `D` move; `Space` shoot; `S` activate shield; `1` buy 30 bullets (🪙100); `2` buy shield (🪙70); `3` buy life (🪙200).
- Mobile controls: on-screen touch buttons (← →, 🔫, 🛡) rendered as React overlay over canvas, visible only on touch devices (`isTouchDevice` flag at component level). Fire button auto-fires on hold via `setInterval`. Actions bridged into the game loop via `touchControlsRef`.
- Mobile layout: `100dvh` container, `viewport-fit=cover`, `env(safe-area-inset-bottom)` for iPhone home bar. Ship and rocks are scaled down on touch devices (`shipW/H` and `rockScale = 0.6`). Fixed-timestep game loop (`STEP = 1000/60`, accumulator pattern) ensures consistent speed regardless of display fps.
- Multiplayer (future) will need to extract ship logic into a reusable factory and manage multiple input sources (keyboard zones or WebSocket).
- `alien-rescue-game.html` (standalone prototype) is no longer in the repo — reference only in git history.

## Commands

### /commit
Analyze `git diff` and `git status`, then output (do NOT run git commit):
1. Each changed file with one sentence describing what changed
2. A commit title (under 72 chars, imperative mood)
3. A short body (2–4 lines) if changes span multiple concerns

### /update-docs
Re-scan the project structure and update this CLAUDE.md:
- Refresh the Key Files table if files were added, removed, or renamed
- Update Architecture Notes if the game loop or component structure changed
- Note any new planned features or completed ones
- Keep the file concise — no padding, no obvious statements

## Hooks (auto-behaviors)

Configured in `.claude/settings.json`:

- **After editing `pages/game.js`**: reminds to test at localhost:3000/game
- **After editing `locales/en.js`**: reminds to update `fr.js` with matching keys

## Code Conventions
- Game loop variables live inside `useEffect` as `let` — do not lift them to React state unless they appear in JSX
- New visual elements go in the main `draw()` function, new logic in `update()`
- Keep collision detection functions pure (take coords/sizes, return bool)
- String copy: landing-page UI text goes through `locales/`; game overlay text (score, level, HUD) lives directly in `pages/game.js`
- No TypeScript in game files (`.js`) — the project uses TS only for config files

## Running & Testing
```bash
yarn dev       # start dev server at localhost:3000
yarn build     # production build
yarn lint      # ESLint check
```
Game is at http://localhost:3000/game. Test by playing: move ship, take hits, reach game-over, restart.

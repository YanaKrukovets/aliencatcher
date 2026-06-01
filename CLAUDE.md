# Alifallx: Don't Leave Them Behind — Claude Code Guide

## Project Overview
Space arcade game built with **Next.js 13 + Tailwind CSS**. Players control a spaceship on an HTML5 canvas, dodge rocks, and catch/destroy aliens. The site also has a landing page with About, Contact, and game info sections.

Completed features: multiple levels with dynamic difficulty scaling (speed, spawn rates, color palettes per level), level-up banner/animation, countdown timer at game start.

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
- Level progression: level 1→2 at 30 pts, then every 50 pts (`scoreVal < 30 ? 1 : Math.floor((scoreVal - 30) / 50) + 2`). Each level increases alien/rock speed, tightens spawn intervals, and switches color palettes (`LEVEL_PALETTES`/`LEVEL_COLORS`).
- Multi-alien spawns activate at level 2+ via `multiChance`; speed variance adds at level 5+.
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

### /review-game
Focused review of `pages/game.js`:
- Memory leaks (event listeners, animation frames not cleaned up)
- Performance issues in the render loop
- Logic bugs in collision detection
- Suggest refactors only if clearly needed

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

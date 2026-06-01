# Alien Catcher — Claude Code Guide

## Project Overview
Space arcade game built with **Next.js 13 + Tailwind CSS**. Players control a spaceship on an HTML5 canvas, dodge rocks, and catch/destroy aliens. The site also has a landing page with About, Contact, and game info sections.

Planned future features: multiple levels with increasing difficulty, multiplayer (2+ players on same device or online), power-ups and upgrades, leaderboard.

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
| `pages/game.js` | Full canvas game loop — ship, aliens, rocks, particles, scoring |
| `pages/index.js` | Landing page |
| `components/Header.js` | Site header |
| `components/Navbar.js` | Navigation bar |
| `components/HomeBanner.js` | Hero section |
| `components/AboutGame.js` | Game description section |
| `locales/en.js` | English strings |
| `locales/fr.js` | French strings |
| `alien-rescue-game.html` | Standalone prototype (not used in Next.js build) |

## Architecture Notes
- `pages/game.js` uses a single large `useEffect` containing the full game loop — keep game state in `let` vars inside the effect, React state only for UI overlay (score, lives, game-over screen).
- Adding a new level = new difficulty config object + swap it in when score threshold is reached.
- Multiplayer (future) will need to extract ship logic into a reusable factory and manage multiple input sources (keyboard zones or WebSocket).

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
- String copy: always go through `locales/` — no hardcoded UI text
- No TypeScript in game files (`.js`) — the project uses TS only for config files

## Running & Testing
```bash
yarn dev       # start dev server at localhost:3000
yarn build     # production build
yarn lint      # ESLint check
```
Game is at http://localhost:3000/game. Test by playing: move ship, take hits, reach game-over, restart.

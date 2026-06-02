Re-scan the project and update `CLAUDE.md` in place. Do not rewrite the whole file — only edit sections where something actually changed. Follow this checklist:

**Key Files table**
- Add any new files under `pages/`, `components/`, `locales/`, or `styles/` that are missing from the table
- Remove rows for files that no longer exist
- Update the Purpose column if a file's role has changed

**Architecture Notes**
- Update the level progression formula if the code in `pages/game.js` differs from what is documented (check the actual `scoreVal`/level logic, not the old comment)
- Note any new entity classes added inside the useEffect (e.g. new alien types, projectile types)
- Update the multiplayer note if any progress has been made toward extracting ship logic

**Planned / Completed features**
- Move items from "Planned" to "Completed" if they are implemented in the code
- Add newly planned features only if the user has mentioned them in this session

**Rules:**
- Keep the file concise — no padding, no obvious statements
- Do not change the Commands section or Hooks section unless the user asked for it
- After editing, output a brief summary of what changed (one bullet per section touched)

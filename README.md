# Adopt a Procrastinator 🐣

A cozy, fully local productivity game built for a one-hour vibe-coding hackathon. Adopt Mochi, Byte, or Procrastino; complete real-life missions; earn treats; and grow from a sleepy egg into a Productivity Beast.

## Run locally

Requires Node.js 22.12+ (or 20.19+) and npm.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. No account, backend, external API, or paid service is required. Once dependencies are installed, the app, illustrations, fonts, and game work without internet access through the local server.

```sh
npm test
npm run build
npm run preview
```

## What's included

- Landing, three-character adoption, naming, and responsive game dashboard.
- Missions with descriptions, priorities, estimated time, completion, deletion, and Undo.
- Exactly 20 XP per task; 100 XP per level; five illustrated evolution stages with continuing levels.
- Animated, mood-aware SVG pets; happiness, energy, feeding, daily rest, and supportive messages.
- Three-mission daily goal, calendar-day streaks, unlockable food, hats, and crowns.
- Immediate localStorage persistence, save validation, recovery copies for malformed saves, and storage-failure feedback.
- Keyboard-accessible dialogs, inline validation, responsive layouts, and reduced-motion support.

## Game rules

Task completion gives +20 XP, +8 happiness, and +3 energy. Completing all active missions gives +8 happiness once per local day. Three completions earn one cookie each day. A daily rest restores 20 energy; food restores energy and happiness. A new day uses 5 energy (at most 15 per return); overdue tasks cost only 3 happiness on return. XP never decays. Streaks use browser-local calendar dates rather than rolling 24-hour windows.

Deleting a mission preserves earned XP and daily history. A completed mission cannot be rewarded again. Consumables are finite; cosmetics can be put on and taken off. The first cookie is a welcome gift.

## Data and privacy

Progress stays in the current browser under `adopt-a-procrastinator:v1`. There is no cloud sync. Clearing browser storage or confirming Reset game deletes progress. Keep the same browser and origin to retain your pet. Tabs receive save updates; this is a single-player MVP, not a transactional multi-user service.

## Implementation

React + Vite, Tailwind CSS, Lucide icons, self-hosted Nunito/DM Sans fonts, original inline SVG creatures, and plain CSS animations. Game rules are isolated in `src/game.js`. Visual decisions and shared interaction contracts are documented in `DESIGN.md` and `UX-CONTRACT.md`.

No generated API keys or credentials are needed. Application code and illustrations were created with AI assistance for this hackathon.

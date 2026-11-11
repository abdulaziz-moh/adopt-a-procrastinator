# Adopt a Procrastinator interaction contract

The user brief defines the product. Visual decisions live in DESIGN.md.

## Canonical UI Map

| Capability     | Canonical owner                               | Source of truth | Allowed variants                                    | Verification                        |
| -------------- | --------------------------------------------- | --------------- | --------------------------------------------------- | ----------------------------------- |
| Select/Listbox | Native priority select in TaskForm            | This contract   | native OS popup accepted                            | E2E select + keyboard               |
| Date           | src/game.js localDate/dateGap                 | This contract   | browser-local Gregorian calendar; no date input     | unit date boundaries                |
| Form           | TaskForm and PetAdoption, shared field styles | This contract   | synchronous create/adopt                            | invalid-input E2E                   |
| Scrollbar      | src/styles.css global baseline                | DESIGN.md       | no hidden scrollbars                                | CSS + narrow browser                |
| Toast          | App feedback state and shared Toast           | This contract   | success/info, Undo action                           | live-region E2E                     |
| CRUD           | gameReducer + TaskManager                     | This contract   | create, irrevocable completion, reversible deletion | full-flow E2E                       |
| Dialog         | Shared Modal native dialog                    | This contract   | task, help, evolution, reset                        | Escape, focus restoration, keyboard |

## Behavior

- Landing → adoption → dashboard. Cancel adoption returns to landing. Adopt saves immediately and returns dashboard; returning users resume dashboard.
- A task is a unique ID, title, optional description, priority, optional whole-number minutes (1–1440), creation date and completion timestamp. Trim text, require 1–100 title characters, limit description to 280. Invalid fields retain values, have associated text errors, and receive focus.
- Completion is one way and rewards exactly once. Every task gives 20 XP, +8 happiness and +3 energy. Every 100 XP grants a level. Stages cap at Productivity Beast while levels can continue. Deletes do not remove earned XP, daily completion records, or streaks. Undo restores the task without extra rewards.
- Three daily completions unlock one cookie per local date. Finishing all active missions grants +8 happiness once per local date. These rewards cannot be farmed by adding/deleting tasks.
- Streak counts consecutive local calendar dates with completions. Opening the app does not create a streak. A streak stays visible on a rest day until the next calendar date is missed. Date difference uses UTC ordinals constructed from local date parts to survive DST.
- On each new calendar date, energy falls by 5 (bounded to a maximum 15 loss per return). If an overdue active task exists, happiness falls by 3 once on return, never per ignored task. No inactivity XP loss or progress loss. Food restores 20 energy/+5 happiness; a daily rest restores 20 energy/+3 happiness once per date. All stats clamp to 0–100.
- Adoption begins at level 1, XP 0, happiness 70, energy 80, no completed tasks. One starter cookie is included. Starter missions are optional and never appear as already completed.
- Rewards unlock at levels 2 (pizza), 3 (party hat), 4 (fictional energy potion), 5 (crown). Consumables are finite; cosmetics toggle equipped status. Rewards have visible requirements when locked.
- Pet mood derives from low energy, low happiness, recent completion, and active tasks. A transient celebration takes priority. Speech is humorous and supportive.
- Daily task filtering is transient local UI state; no query URL persistence because the list contains private local missions and has no shareable server dataset. Show eight tasks, then explicit Show more. Completed tasks remain available in a completed filter.
- Storage is localStorage only, schema version 1. Validate loaded data and reconstruct derived level/stage. Preserve malformed raw data under a recovery key when possible; show recovery warning. Save synchronously at commit, report storage failure persistently, and offer retry. No accounts or sync claims. Cross-tab storage events replace committed state with the latest saved state; actions read latest storage before reducing to avoid stale XP writes.
- Reset uses app-owned confirmation, names loss of the pet, tasks and progress, initially focuses Cancel, and returns to landing. No browser confirm/alert/prompt.
- Shared feedback uses one aria-live polite region. Field errors remain inline. Modal Escape closes and returns focus. Form drafts stay intact while open; closing an unsubmitted task form discards the unsaved draft. No remote requests or loading simulation.
- Native semantics, 44px actions, visible focus, sufficient text contrast, and reduced-motion support. Tablet/mobile stack without horizontal overflow.

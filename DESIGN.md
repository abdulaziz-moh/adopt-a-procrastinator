---
version: alpha
name: Adopt a Procrastinator
description: A little illustrated sanctuary where real-life tasks help an unhurried creature grow.
colors:
  background: "#FFF9F0"
  surface: "#FFFFFF"
  ink: "#292735"
  muted: "#716C7B"
  primary: "#7860AC"
  lavender: "#A78BFA"
  lilac: "#EDE5F8"
  peach: "#FDBA9B"
  mint: "#86DDB5"
  danger: "#A23F50"
  border: "#EAE5EC"
typography:
  display:
    fontFamily: 'Nunito, "Trebuchet MS", sans-serif'
  sans:
    fontFamily: '"DM Sans", system-ui, sans-serif'
rounded:
  DEFAULT: "16px"
  card: "24px"
  arena: "32px"
spacing:
  unit: "8px"
  page-max: "1200px"
  section-gap: "24px"
components:
  button: { minHeight: "44px" }
  card: { borderWidth: "1px" }
  dialog: { maxWidth: "480px" }
---

## Overview

The North Star is an illustrated care journal crossed with a tiny pet sanctuary. Students and desk workers turn one small task into a visible act of care. English, browser-local calendar dates, no market-specific business rules, desktop and mobile. Landing is expressive; adoption and dashboard are product surfaces.

Signature: a hand-drawn, animated creature on a little lavender island, surrounded by paper-like labels and reassuring speech. Keep utility controls restrained so the creature carries the personality. Avoid corporate admin panels, competitive leaderboards, guilt, or alarm styling for ordinary inactivity.

Initial critique: a plain pastel card grid would lose the game. The oversized habitat, evolving SVG anatomy, asymmetrical landing composition, and journal-like progress path establish the pet as the center.

## Colors

Warm cream surrounds white utility cards. Lavender/lilac own the pet world; dark primary owns actionable text. Peach signals energy and mint signals completion. Danger is reserved for reset/delete. All semantic tokens originate in `src/styles.css :root`; this document mirrors that runtime source (Model B). CSS variables feed Tailwind through `@theme inline` and shared components. `tests/design.test.js` checks mirrored color tokens as part of `npm test`.

## Typography

Self-hosted Nunito 700/800/900 gives headings a rounded, friendly voice. Self-hosted DM Sans 400/500/600/700 handles tasks and interface text. No font CDN. Numeric progress uses tabular figures. Body text starts at 14–16px with 1.5 line height; headings use a compact line height.

## Layout

8px rhythm, 1200px maximum width, 24px section gaps. Desktop dashboard pairs a 44% pet column with a wider missions column. At 800px the content stacks; at 480px controls wrap and cards tighten. Document owns scrolling. No fixed screen height. Long task titles wrap, and task lists reveal eight rows at a time.

## Elevation & Depth

White cards have a thin warm border and very soft shadow. Habitat uses a softly shaded floor, a restrained radial glow, and a large rounded silhouette. Only dialogs and the toast float above content. No decorative glass or pervasive gradients.

## Shapes

24px cards, 32px arena, 16px controls; badges and progress tracks use pills. SVG creatures use organic contours and imperfect-looking strokes. Icons use Lucide at 18–20px and 1.8 stroke width.

## Components

Shared Button, Modal, StatBar, SectionHeading, and toast own common behavior. Buttons share 44px targets, visible focus, hover, pressed and disabled states. Forms use owned inline validation and field labels. A native priority select deliberately accepts the operating system popup. A native dialog owns focus trapping, Escape, and inert background; app styling owns its contents and restores invoking focus.

All state commits are immediate local operations. Unavailable storage gets a persistent banner and a retry control. Empty task lists invite one small mission. No loading indicators are needed for synchronous local actions. Reset names its consequence and requires confirmation; task deletion has Undo.

Idle float and blinking create a living creature. Completion triggers a short hop; level-up adds celebratory confetti. Reduced motion disables animated movement while retaining state changes and text feedback. The global stylesheet owns scrollbar track, thumb, hover, active and forced-color treatment.

Voice: a supportive friend with an excellent excuse collection. Small steps count. Never infer that the user failed as a person. Controls say what they do; the pet may make jokes.

## Do's and Don'ts

- Do show the result of each completed task through the pet and clear XP feedback.
- Do preserve earned progress if a completed task is deleted.
- Don't punish time away with compounding penalties.
- Don't introduce a network dependency into gameplay or display fictional statistics.

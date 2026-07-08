# Basecamp — Productivity Dashboard

A single-page productivity dashboard that brings together a todo list, daily planner, daily goals, a pomodoro timer, and a motivation widget — all inside one bento-style layout, built with plain HTML, CSS, and JavaScript.

**Live Preview:** [ADD DEPLOYED LINK HERE]

---

## Overview

This project was built as a DOM manipulation and browser-storage practice exercise. The goal was to combine several small, independent daily-use tools into a single dashboard where a user can manage tasks, plan their day, track focus time, set goals, and stay motivated — without any page reloads and without losing data on refresh.

The app follows one repeating pattern across every feature:

**Dashboard loads → user opens a feature → interacts with it → data saves automatically → user returns to the dashboard.**

---

## Features

| Feature | What it does |
|---|---|
| **Dashboard Navigation** | Home screen with clickable tiles; only one feature is visible at a time, with a guard against duplicate opens |
| **Todo List** | Add, mark important, mark complete, and delete tasks; state is saved to Local Storage on every change |
| **Daily Planner** | Hourly time slots (6 AM – 10 PM) with per-slot notes; current hour is highlighted automatically using the Date object |
| **Daily Goals** | Add short-term goals, mark them done, and see a live progress bar with a completion count |
| **Pomodoro Timer** | Start / Pause / Reset controls with a 25-minute work session and 5-minute break, guarded against multiple overlapping timers |
| **Focus Minutes Tracker** | Tracks total minutes spent in active work sessions for the day, reset daily |
| **Motivation Quote** | Cycles through a local set of quotes on click — no repeats back-to-back |
| **Date & Time Widget** | Live-updating clock and date, always visible in the top bar |
| **Weather Widget** | A simulated, time-of-day-based weather snapshot (no external API used) |
| **Theme Switch** | Light/dark mode toggle, saved to Local Storage and applied before the page paints to avoid a flash of the wrong theme |
| **Dynamic Background** | Background tone shifts gently based on the real time of day |

---

## UI Design

The interface is designed around a **bento grid layout**, inspired by a modern agency-style landing page reference (large hero tile + supporting tiles + a stat/pill row). Each feature has its own tile shape on the dashboard, and clicking a tile opens that feature in a clean, full-panel view.

**Design tokens used:**

- **Layout:** A large rounded "shell" container on a soft gray canvas, holding a 12-column bento grid — one large hero tile, two supporting tiles, and a row of stat/tag tiles below.
- **Color:** A cool neutral palette (soft gray canvas, white surface cards) paired with a violet-to-indigo gradient for the primary accent tile and a deep teal gradient for the timer tile — chosen instead of default AI-generated palettes (no cream/terracotta, no near-black/neon).
- **Typography:** Space Grotesk for headings and stat numbers (bold, geometric feel), Inter for body text and UI labels, and IBM Plex Mono for the clock and timer digits — giving the numeric widgets a distinct "instrument panel" feel.
- **Iconography:** Custom inline SVG line icons (sun, cloud, moon, arrow) instead of emoji, to keep the interface feeling considered rather than generic.
- **Signature element:** A scattered, tilted pill-tag cluster for the Motivation tile — the one deliberately bold/playful element, kept calm everywhere else.
- **Responsiveness:** The bento grid collapses to a single column on smaller screens; all interactive elements have visible focus states for keyboard use; motion is disabled for users with `prefers-reduced-motion` set.

---

## Tech Stack

- HTML5 — semantic structure, no framework
- CSS3 — CSS variables for theming, CSS Grid for the bento layout, no CSS framework
- Vanilla JavaScript — DOM manipulation, event delegation, Local Storage, Date object, `setInterval`/`clearInterval`
- No external APIs — the weather and motivation widgets use local, built-in data instead of live network requests

---

## Project Structure

```
basecamp-dashboard/
├── index.html      # structure — dashboard grid + all feature sections
├── style.css       # theming, bento grid, feature view styling
├── script.js       # navigation, feature logic, storage, timers
└── README.md
```

---

## Running Locally

No build step or server required.

1. Download all three files (`index.html`, `style.css`, `script.js`) into the same folder.
2. Open `index.html` directly in a browser.

All data (tasks, goals, planner entries, theme choice) persists across refreshes via Local Storage, scoped to your browser only.

---

## Challenges Faced

A few parts of this build needed more than just following the implementation steps — they needed research into *why* something broke, not just a fix:

- **Single active section state:** Preventing two feature panels from being visible at once, and handling rapid double-clicks on the same card, required tracking the currently open feature in a variable rather than relying on CSS classes alone.
- **Event delegation:** Attaching one listener to each task's buttons broke once tasks were deleted and re-added. Switching to a single delegated listener on the parent list (using `event.target.closest()`) fixed this and is the pattern most real apps use.
- **Keeping Local Storage in sync:** Any mismatch between the in-memory array, the rendered DOM, and what was saved would look fine until a refresh, then silently revert. The fix was enforcing one direction always: update the array → save to storage → re-render from the array.
- **Preventing stacked Pomodoro intervals:** Clicking "Start" twice without a guard spawned a second `setInterval`, making the countdown skip seconds. A simple `if (timerIntervalId !== null) return;` check solved it.
- **Theme flash on load:** Even after saving the theme choice, the page would briefly flash light mode before switching to dark. The fix required applying the saved theme in the `<head>`, before the CSS paints, instead of in the main script.

These issues were identified and understood with the help of AI tools and general web research, then implemented and tested against this project's own data structures.

---

## Learning Outcomes

- Building a multi-section, single-page app using pure DOM manipulation
- Managing and persisting application state with Local Storage
- Structuring a growing JavaScript file into organized, reusable logic
- Using the Date object and timers to build time-aware, live-updating features
- Implementing a light/dark theme system with CSS variables
- Applying an intentional visual design system instead of default styling
Preview link: https://task-5-suryansh-rajput.vercel.app/

Project: Dribbble-like Gallery — Task 5
=====================================

Summary
-------
I chose the hardest one (as I usually do) and completed the task in one night — approximately 6 hours.

What I implemented
------------------
- Gallery layout in `section-2` with multiple cards.
- Hover overlay on media (image/video) showing title and action icons.
- Compact info row under each card (author avatar + stats).

How to preview
--------------
- Open `index.html` in a browser, or run a local Live Server at the project root and navigate to `/task-5/`.
- Paste a live preview URL above in the "Preview link" space.

CSS techniques and features used
-------------------------------
Below are the main CSS concepts and properties used in this task (as implemented in `style.css`):

- Global reset and box model
  - `* { box-sizing: border-box; margin: 0; padding: 0; }`
- Font stack
  - System UI stack via `font-family` on `html, body`.
- Layout systems
  - CSS Grid for page-level layout (`#section-1`, `#section-2` grid definitions).
  - Flexbox for row and component alignment (`nav`, header, `.info`, `.logo-track`, `.overlay`).
- Sizing and spacing
  - `gap`, `padding`, `margin`, `width`, `height`, `max-width`, `min-height` used to size containers.
- Media handling
  - `img` and `video` use `width: 100%`, `height: auto`, and `object-fit: cover` to preserve aspect ratio while filling the card area.
  - `max-height` used to keep the gallery thumbnails consistent.
- Positioning and stacking
  - `position: relative` on `.image-box` and `position: absolute` on `.overlay` for overlay placement.
  - `z-index` to ensure the overlay appears above the media.
- Overflow control
  - `overflow: hidden` on `.image-box` to clip the overlay and media within the card.
- Visual style
  - `border-radius` for rounded cards and avatars.
  - `border` and subtle background colors for card separation.
  - `linear-gradient` used for `.overlay` to fade into dark.
- Interactions & animation
  - `transition` and `transform` for hover polish (media scale and overlay slide-in).
  - `@keyframes` animation for the logo marquee (`marquee` animation on `.track`).
- Iconography
  - External icon font (`remixicon`) linked in `index.html` and used inside overlay and info stats.

Important implementation notes
------------------------------
- I moved each `.info` block out of the `.image-box` and made it a sibling so hovering the `.info` area does not trigger the overlay.
- The overlay only appears when hovering the actual `img` or `video` element (CSS selector targets `img:hover + .overlay` / `video:hover + .overlay`).
- Images and videos are constrained with `max-height` and `object-fit: cover` so they don't stretch vertically and maintain a clean grid.

Files changed
-------------
- `index.html` — moved `.info` elements so they sit outside `.image-box` and remain visible under each card.
- `style.css` — updated sizing, hover rules, overlay behavior, and layout tweaks.

Next steps / optional improvements
--------------------------------
- Switch `.image-box` markup to include a `.media` wrapper if you prefer overlay activation when hovering anywhere over the media area.
- Add responsive breakpoints so `#section-2` switches to fewer columns on small screens.
- Lazy-load images for performance (add `loading="lazy"` to `img` tags).

If you want, I can add a live preview URL into the top of this README — paste the URL or tell me to insert the Live Server address and I'll add it.

# Bing Puzzle Game — MVP Plan

## Overview
A web-based, mobile-responsive jigsaw puzzle game for kids (target age: 2+), themed around Bing Bunny. Built with React + Vite, featuring a built-in admin panel to add new puzzles.

---

## Tech Stack
- **React 18 + Vite** (JavaScript, no TypeScript for simplicity)
- **React Router v6** for page navigation
- **CSS** (plain CSS with media queries, no framework — keeps it light)
- **LocalStorage** to persist puzzles added via admin panel
- **HTML5 Drag & Drop API** + touch event polyfill for mobile

---

## Project Structure
```
bing-puzzlegame/
├── public/
│   └── images/              # Uploaded puzzle images
├── src/
│   ├── components/
│   │   ├── PuzzleGame.jsx    # Core 2x2 puzzle logic
│   │   ├── PuzzlePiece.jsx   # Draggable piece (touch + mouse)
│   │   ├── DropZone.jsx      # Target slot on the grid
│   │   ├── PiecePool.jsx     # Scrambled pieces waiting area
│   │   ├── Celebration.jsx   # Confetti/stars on complete
│   │   ├── PuzzleCard.jsx    # Thumbnail card on home page
│   │   ├── AdminLogin.jsx    # Simple password form
│   │   └── AdminPanel.jsx    # Upload image + manage puzzles
│   ├── data/
│   │   └── puzzles.json      # Default built-in puzzles
│   ├── hooks/
│   │   └── usePuzzles.js     # Load/save puzzles (json + localStorage)
│   ├── styles/
│   │   ├── global.css        # Reset, fonts, colors
│   │   ├── home.css
│   │   ├── game.css
│   │   ├── puzzle.css
│   │   └── admin.css
│   ├── pages/
│   │   ├── Home.jsx          # Puzzle selection grid
│   │   ├── Game.jsx          # Active puzzle play page
│   │   └── Admin.jsx         # Admin panel page
│   ├── App.jsx               # Router setup
│   └── main.jsx              # Entry point
├── index.html
├── vite.config.js
└── package.json
```

---

## Features (MVP)

### 1. Home Page (`/`)
- Grid of puzzle cards with thumbnail and title
- Click to start playing
- Empty state message if no puzzles exist

### 2. Puzzle Game (`/play/:id`)
- **2×2 grid** — image split into 4 large, equal pieces
- **Piece Pool** — scrambled pieces shown below the grid
- **Drag to snap** — drag a piece onto the correct grid slot
  - Auto-snaps when within 40px of the correct position
  - Snapped pieces lock in place
- **Touch-friendly** — pieces are big (at least 80px tap target)
- **Celebration** — confetti animation + "Well done!" text when complete
- **Back button** to return to home

### 3. Admin Panel (`/admin`)
- Password-protected (default: `admin` / `admin123`)
- **Add puzzle**: Upload image → set title → save
- Images are stored as base64 in localStorage (no backend needed)
- List existing puzzles with delete option
- **Reset** to default puzzles

### 4. Puzzle Data
- **Default puzzles** in `src/data/puzzles.json`:
  1. Bing Football — orange/green
  2. Bing Ice Cream — pink/blue
  3. Bing Sleep — purple/navy
  4. Bing Play — yellow/red
- Each defined as: `{ id, title, image (base64 or path), thumbnail }`
- Admin-added puzzles merged on top via localStorage

### 5. Placeholder Images
- Since real Bing images aren't available, I'll create **SVG illustrations**:
  - Cute round bunny-like character (orange)
  - Different backgrounds/accessories for each activity
  - Bright, high-contrast colors for toddlers
  - Replaceable anytime via admin panel

---

## How the Puzzle Works (2×2)
1. Load image → split into 4 quadrants (top-left, top-right, bottom-left, bottom-right)
2. Shuffle the 4 pieces and display them in the pool area
3. Grid shows 4 empty drop zones labeled with subtle outlines
4. Child drags a piece → piece follows finger/cursor
5. On release near correct grid cell → piece snaps in with a bounce animation
6. Wrong cell → piece slides back to pool
7. All 4 placed → confetti + "You did it!" + star rating
8. Optional: replay button to shuffle and play again

---

## Responsive Design
- **Mobile first**: single column, pieces fill screen width
- **Tablet**: 2-column layout with grid on left, pool on right
- **Desktop**: centered max-width container
- Touch targets ≥ 48px (WCAG), pieces ~80–120px

---

## Deployment Plan

### Vercel (MVP)
- **Zero-config deploy** — Vercel auto-detects Vite projects
- **Steps**:
  1. Push code to GitHub (`git push origin main`)
  2. Go to [vercel.com](https://vercel.com) → Import repo
  3. Vercel detects Vite → builds with `npm run build` → deploys `dist/` folder
  4. Done! Gets a `*.vercel.app` URL instantly
- **Custom domain** — Can add a custom domain later from Vercel dashboard
- **Free tier** — 100GB bandwidth, unlimited sites, SSL included

### Database?
**Not needed for MVP.** The entire app is client-side:
- Puzzle data & images stored in browser's **localStorage**
- Admin panel saves directly to localStorage
- No server, no API, no database

**When would you need one?**
- If you want puzzles added via admin to be visible on **all devices** (not just one browser)
- If you add user accounts or kid profiles
- If you want analytics (most played puzzles, etc.)

**If/when you need one, I recommend:**
- **Supabase** (free tier, generous limits, PostgreSQL) — easy to add later since the app is already React
- Or keep it simple with a **JSON file hosted on Vercel** that gets updated via the admin panel

---

## Future Enhancements (Post-MVP)
- [ ] 3×3 and 4×4 grid options with difficulty selector
- [ ] Sound effects (piece snap, celebration cheer)
- [ ] Timer + star rating based on speed
- [ ] Multiple kid profiles with progress tracking
- [ ] Real backend (Node.js/Express) for multi-device sync
- [ ] Drag piece rotation for harder puzzles
- [ ] Bing-themed color palette and fonts

---

## Implementation Order
1. Scaffold Vite + React project with routing
2. Add default puzzles JSON with SVG placeholders
3. Build `PuzzleGame`, `PuzzlePiece`, `DropZone`, `PiecePool`
4. Build `Home` page with puzzle grid
5. Build `Admin` page (login + panel)
6. Wire up localStorage persistence
7. Add celebration animation
8. Responsive polish
9. Test on mobile viewport

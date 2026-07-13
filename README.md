# Bing Puzzle Game 🧩

A simple drag-and-drop jigsaw puzzle game for kids, featuring Bing Bunny. Built with React + Vite, responsive for mobile and tablet.

## How to Play

1. Pick a puzzle from the home screen
2. Drag the scrambled pieces from the bottom pool into the correct grid slots
3. Piece auto-snaps when placed in the right spot
4. Complete all 4 to trigger the celebration!

## Admin Panel

Add your own puzzles via the admin panel at `/admin`:

- **Username:** `admin`
- **Password:** `admin123`

Upload images and they're saved locally in your browser.

## Development

```bash
npm install
npm run dev
```

## Tech Stack

- React 18 + Vite
- React Router v6
- CSS (no framework)
- localStorage for puzzle data

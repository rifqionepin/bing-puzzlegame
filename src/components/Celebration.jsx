import { useMemo } from 'react'

const COLORS = ['#FF9800', '#F44336', '#2196F3', '#4CAF50', '#FFEB3B', '#9C27B0', '#FF4081']

export default function Celebration({ show, onReplay, onHome }) {
  const confetti = useMemo(() => {
    if (!show) return []
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 0.5,
      duration: 1.5 + Math.random() * 2,
      size: 6 + Math.random() * 10,
    }))
  }, [show])

  if (!show) return null

  return (
    <>
      <div className="game-complete-overlay" onClick={onReplay}>
        <div className="game-complete-card" onClick={e => e.stopPropagation()}>
          <h2>Well Done!</h2>
          <p>You solved the puzzle!</p>
          <div>
            <button className="btn-primary" onClick={onReplay}>Play Again</button>
            <button className="btn-secondary" onClick={onHome}>Home</button>
          </div>
        </div>
      </div>
      <div className="confetti-container">
        {confetti.map(c => (
          <div
            key={c.id}
            className="confetti-piece"
            style={{
              left: `${c.left}%`,
              top: '-20px',
              background: c.color,
              width: c.size,
              height: c.size,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              animationDelay: `${c.delay}s`,
              animationDuration: `${c.duration}s`,
            }}
          />
        ))}
      </div>
    </>
  )
}

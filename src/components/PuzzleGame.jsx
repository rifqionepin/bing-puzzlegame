import { useState, useRef, useEffect } from 'react'
import Celebration from './Celebration'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function PuzzleGame({ puzzle, onHome }) {
  const [pieces, setPieces] = useState(() => shuffle([0, 1, 2, 3]))
  const [placed, setPlaced] = useState({})
  const [dragging, setDragging] = useState(null)
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 })
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [dragSize, setDragSize] = useState({ w: 80, h: 80 })
  const [completed, setCompleted] = useState(false)
  const draggingRef = useRef(null)
  const placedRef = useRef(placed)
  const gridRef = useRef(null)

  placedRef.current = placed

  useEffect(() => {
    setPieces(shuffle([0, 1, 2, 3]))
    setPlaced({})
    setCompleted(false)
  }, [puzzle.id])

  useEffect(() => {
    if (Object.keys(placed).length === 4) {
      setTimeout(() => setCompleted(true), 400)
    }
  }, [placed])

  function startDrag(e, pieceIndex) {
    const el = e.currentTarget || e.target
    const rect = el.getBoundingClientRect()
    draggingRef.current = pieceIndex
    setDragging(pieceIndex)
    setDragSize({ w: rect.width, h: rect.height })
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
    setDragPos({ x: e.clientX, y: e.clientY })

    function onMove(ev) {
      setDragPos({ x: ev.clientX, y: ev.clientY })
    }

    function onUp(ev) {
      const idx = draggingRef.current
      const currentPlaced = placedRef.current
      const dropZones = document.querySelectorAll('.drop-zone')

      dropZones.forEach((zone, index) => {
        const rect = zone.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dist = Math.hypot(ev.clientX - cx, ev.clientY - cy)
        const threshold = Math.max(rect.width, rect.height) * 0.6

        if (dist < threshold && idx === index && !currentPlaced[index]) {
          setPlaced(prev => ({ ...prev, [index]: idx }))
          setPieces(prev => prev.filter(p => p !== idx))
        }
      })

      draggingRef.current = null
      setDragging(null)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  function handlePointerDown(e, pieceIndex) {
    e.preventDefault()
    startDrag(e, pieceIndex)
  }

  function handleMouseDown(e, pieceIndex) {
    if (e.button !== 0) return
    e.preventDefault()
    startDrag(e, pieceIndex)
  }

  function getBackgroundStyle(posIndex) {
    const x = posIndex % 2 === 0 ? '0%' : '100%'
    const y = posIndex < 2 ? '0%' : '100%'
    return {
      backgroundImage: `url("${puzzle.image}")`,
      backgroundSize: '200% 200%',
      backgroundPosition: `${x} ${y}`,
    }
  }

  function handleReplay() {
    setPieces(shuffle([0, 1, 2, 3]))
    setPlaced({})
    setCompleted(false)
  }

  return (
    <div className="game">
      <div className="game-header">
        <button className="game-back" onClick={onHome}>←</button>
        <span className="game-title">{puzzle.title}</span>
      </div>

      <div className="game-area" ref={gridRef}>
        <div className="puzzle-grid">
          {[0, 1, 2, 3].map(index => (
            <div key={index} className={`drop-zone ${placed[index] !== undefined ? 'filled' : ''}`}>
              {placed[index] !== undefined ? (
                <div className="piece-slot" style={getBackgroundStyle(index)} />
              ) : (
                <div className="drop-zone-hint">?</div>
              )}
            </div>
          ))}
        </div>

        {pieces.length > 0 && (
          <div className="piece-pool">
            <div className="piece-pool-label">Pieces</div>
            {pieces.map((pieceIndex) => (
              <div
                key={pieceIndex}
                className={`puzzle-piece ${dragging === pieceIndex ? 'dragging-source' : ''}`}
                style={getBackgroundStyle(pieceIndex)}
                onPointerDown={(e) => handlePointerDown(e, pieceIndex)}
                onMouseDown={(e) => handleMouseDown(e, pieceIndex)}
              />
            ))}
          </div>
        )}
      </div>

      {dragging !== null && (
        <div
          className="puzzle-piece dragging"
          style={{
            ...getBackgroundStyle(dragging),
            width: dragSize.w,
            height: dragSize.h,
            left: dragPos.x - dragOffset.x,
            top: dragPos.y - dragOffset.y,
          }}
        />
      )}

      <Celebration show={completed} onReplay={handleReplay} onHome={onHome} />
    </div>
  )
}

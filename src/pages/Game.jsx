import { useParams, useNavigate } from 'react-router-dom'
import { usePuzzles } from '../hooks/usePuzzles'
import PuzzleGame from '../components/PuzzleGame'
import '../styles/game.css'

export default function Game() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getPuzzle } = usePuzzles()
  const puzzle = getPuzzle(id)

  if (!puzzle) {
    return (
      <div className="game" style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <h2>Puzzle not found</h2>
        <button className="game-back" onClick={() => navigate('/')} style={{ marginTop: 16 }}>
          ← Go Home
        </button>
      </div>
    )
  }

  return <PuzzleGame puzzle={puzzle} onHome={() => navigate('/')} />
}

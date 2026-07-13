import { useNavigate } from 'react-router-dom'
import { usePuzzles } from '../hooks/usePuzzles'
import PuzzleCard from '../components/PuzzleCard'
import '../styles/home.css'

export default function Home() {
  const navigate = useNavigate()
  const { puzzles } = usePuzzles()

  return (
    <div className="home">
      <div className="home-header">
        <h1>Bing Puzzle</h1>
        <p>Pick a puzzle to play!</p>
      </div>

      {puzzles.length === 0 ? (
        <div className="home-empty">
          <h2>No puzzles yet</h2>
          <p>Ask a grown-up to add some!</p>
        </div>
      ) : (
        <div className="puzzle-grid">
          {puzzles.map(puzzle => (
            <PuzzleCard key={puzzle.id} puzzle={puzzle} />
          ))}
        </div>
      )}

      <div className="home-footer">
        <button className="admin-link" onClick={() => navigate('/admin')}>
          Admin Panel
        </button>
      </div>
    </div>
  )
}

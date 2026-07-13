import { useNavigate } from 'react-router-dom'

export default function PuzzleCard({ puzzle }) {
  const navigate = useNavigate()

  return (
    <div className="puzzle-card" onClick={() => navigate(`/play/${puzzle.id}`)}>
      <img className="puzzle-card-thumb" src={puzzle.image} alt={puzzle.title} />
      <div className="puzzle-card-title">{puzzle.title}</div>
    </div>
  )
}

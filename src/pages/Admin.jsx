import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePuzzles } from '../hooks/usePuzzles'
import AdminLogin from '../components/AdminLogin'
import AdminPanel from '../components/AdminPanel'
import '../styles/admin.css'

export default function Admin() {
  const navigate = useNavigate()
  const [loggedIn, setLoggedIn] = useState(false)
  const { puzzles, customPuzzles, addPuzzle, deletePuzzle, resetToDefaults } = usePuzzles()

  if (!loggedIn) {
    return <AdminLogin onLogin={() => setLoggedIn(true)} />
  }

  return (
    <AdminPanel
      puzzles={puzzles}
      customPuzzles={customPuzzles}
      onAdd={addPuzzle}
      onDelete={deletePuzzle}
      onReset={resetToDefaults}
      onBack={() => navigate('/')}
    />
  )
}

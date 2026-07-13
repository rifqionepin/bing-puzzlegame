import { useState, useEffect } from 'react'
import defaultPuzzles from '../data/puzzles.json'

const STORAGE_KEY = 'bing_puzzle_custom'

function loadCustomPuzzles() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveCustomPuzzles(puzzles) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(puzzles))
}

export function usePuzzles() {
  const [puzzles, setPuzzles] = useState([])
  const [customPuzzles, setCustomPuzzles] = useState([])

  useEffect(() => {
    setCustomPuzzles(loadCustomPuzzles())
  }, [])

  useEffect(() => {
    const all = [...defaultPuzzles, ...customPuzzles]
    setPuzzles(all)
  }, [customPuzzles])

  function addPuzzle(title, imageDataUrl) {
    const id = 'custom_' + Date.now()
    const newPuzzle = { id, title, image: imageDataUrl }
    const updated = [...customPuzzles, newPuzzle]
    setCustomPuzzles(updated)
    saveCustomPuzzles(updated)
    return newPuzzle
  }

  function deletePuzzle(id) {
    const updated = customPuzzles.filter(p => p.id !== id)
    setCustomPuzzles(updated)
    saveCustomPuzzles(updated)
  }

  function resetToDefaults() {
    setCustomPuzzles([])
    localStorage.removeItem(STORAGE_KEY)
  }

  function getPuzzle(id) {
    return puzzles.find(p => p.id === id) || null
  }

  return { puzzles, customPuzzles, addPuzzle, deletePuzzle, resetToDefaults, getPuzzle }
}

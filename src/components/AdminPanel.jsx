import { useState, useRef } from 'react'
import ImageCropper from './ImageCropper'

export default function AdminPanel({ puzzles, customPuzzles, onAdd, onDelete, onReset, onBack }) {
  const [title, setTitle] = useState('')
  const [imageData, setImageData] = useState(null)
  const [preview, setPreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const fileRef = useRef(null)
  const cropperRef = useRef(null)

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setImageData(ev.target.result)
      setPreview(ev.target.result)
    }
    reader.readAsDataURL(file)
  }

  function handleSave() {
    if (!title.trim() || !imageData) return
    setSaving(true)
    let finalImage = imageData
    if (cropperRef.current) {
      finalImage = cropperRef.current.getCroppedImage()
    }
    onAdd(title.trim(), finalImage)
    setTitle('')
    setImageData(null)
    setPreview(null)
    if (fileRef.current) fileRef.current.value = ''
    setSaving(false)
    showToast('Puzzle added!')
  }

  function handleDelete(id) {
    onDelete(id)
    showToast('Puzzle deleted')
  }

  function handleReset() {
    if (window.confirm('Reset all custom puzzles to defaults?')) {
      onReset()
      showToast('Reset to defaults')
    }
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <button className="admin-btn-back" onClick={onBack}>← Back</button>
      </div>

      <div className="admin-section">
        <h2>Add New Puzzle</h2>
        <div className="admin-form-group">
          <label>Puzzle Title</label>
          <input
            type="text"
            placeholder="e.g. Bing Birthday"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>
        <div className="admin-form-group">
          <label>Image</label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {preview && (
            <ImageCropper ref={cropperRef} src={preview} />
          )}
        </div>
        <button
          className="admin-btn-save"
          onClick={handleSave}
          disabled={!title.trim() || !imageData || saving}
        >
          {saving ? 'Saving...' : 'Save Puzzle'}
        </button>
      </div>

      <div className="admin-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ margin: 0 }}>All Puzzles ({puzzles.length})</h2>
          {customPuzzles.length > 0 && (
            <button className="admin-btn-reset" onClick={handleReset}>
              Reset All
            </button>
          )}
        </div>
        <div className="admin-puzzle-list">
          {puzzles.map(p => {
            const isCustom = p.id.startsWith('custom_')
            return (
              <div key={p.id} className="admin-puzzle-item">
                <img className="admin-puzzle-item-thumb" src={p.image} alt={p.title} />
                <span className="admin-puzzle-item-title">{p.title}</span>
                <span className="admin-puzzle-item-badge">
                  {isCustom ? 'Custom' : 'Default'}
                </span>
                {isCustom && (
                  <button className="admin-btn-delete" onClick={() => handleDelete(p.id)}>
                    Delete
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {toast && <div className="admin-toast">{toast}</div>}
    </div>
  )
}

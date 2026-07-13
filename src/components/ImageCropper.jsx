import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max)
}

const ImageCropper = forwardRef(function ImageCropper({ src }, ref) {
  const containerRef = useRef(null)
  const imgRef = useRef(null)
  const selRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const [natural, setNatural] = useState({ w: 0, h: 0 })
  const [displaySize, setDisplaySize] = useState({ w: 0, h: 0 })
  const [crop, setCrop] = useState({ x: 0, y: 0, size: 0 })
  const [dragging, setDragging] = useState(null)
  const dragStartRef = useRef({ x: 0, y: 0, crop: { x: 0, y: 0, size: 0 } })

  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      imgRef.current = img
      setNatural({ w: img.naturalWidth, h: img.naturalHeight })
      setLoaded(true)
    }
    img.src = src
  }, [src])

  useEffect(() => {
    if (!loaded || !imgRef.current) return
    const img = imgRef.current
    const maxW = containerRef.current?.clientWidth || 400
    const maxH = 360
    let w, h
    const ratio = img.naturalWidth / img.naturalHeight
    if (ratio > 1) {
      w = Math.min(img.naturalWidth, maxW)
      h = w / ratio
    } else {
      h = Math.min(img.naturalHeight, maxH)
      w = h * ratio
    }
    if (h > maxH) {
      h = maxH
      w = h * ratio
    }
    setDisplaySize({ w, h })

    const size = Math.min(w, h) * 0.8
    setCrop({ x: (w - size) / 2, y: (h - size) / 2, size })
  }, [loaded, natural])

  function displayToNatural(displayX, displayY, displaySize) {
    const scale = natural.w / displaySize.w
    return {
      sx: displayX * scale,
      sy: displayY * scale,
      sSize: displaySize * scale,
    }
  }

  useImperativeHandle(ref, () => ({
    getCroppedImage() {
      const { sx, sy, sSize } = displayToNatural(crop.x, crop.y, crop.size)
      const outSize = Math.min(Math.round(sSize), 600)
      const c = document.createElement('canvas')
      c.width = outSize
      c.height = outSize
      const ctx = c.getContext('2d')
      ctx.drawImage(imgRef.current, Math.round(sx), Math.round(sy), Math.round(sSize), Math.round(sSize), 0, 0, outSize, outSize)
      return c.toDataURL('image/jpeg', 0.6)
    },
  }))

  function getPos(e) {
    const rect = containerRef.current.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  useEffect(() => {
    const sel = selRef.current
    if (!sel || !loaded) return

    function onDown(e) {
      if (e.button !== 0) return
      e.preventDefault()
      const type = e.target.closest('.cropper-handle') ? 'resize' : 'move'
      setDragging(type)
      const pos = getPos(e)
      dragStartRef.current = { x: pos.x, y: pos.y, crop: { ...crop } }
    }

    sel.addEventListener('mousedown', onDown)
    sel.addEventListener('pointerdown', onDown)

    return () => {
      sel.removeEventListener('mousedown', onDown)
      sel.removeEventListener('pointerdown', onDown)
    }
  }, [loaded, crop, displaySize])

  useEffect(() => {
    if (!dragging) return

    function onMove(e) {
      const pos = getPos(e)
      const dx = pos.x - dragStartRef.current.x
      const dy = pos.y - dragStartRef.current.y
      const start = dragStartRef.current.crop

      if (dragging === 'move') {
        setCrop(prev => ({
          ...prev,
          x: clamp(start.x + dx, 0, displaySize.w - prev.size),
          y: clamp(start.y + dy, 0, displaySize.h - prev.size),
        }))
      } else {
        const newSize = clamp(start.size + dx, 40, Math.min(displaySize.w, displaySize.h))
        setCrop(prev => ({
          ...prev,
          size: newSize,
          x: clamp(start.x + dx - (newSize - start.size) / 2, 0, displaySize.w - newSize),
          y: clamp(start.y + dy - (newSize - start.size) / 2, 0, displaySize.h - newSize),
        }))
      }
    }

    function onUp() {
      setDragging(null)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [dragging, displaySize])

  return (
    <div
      className="cropper-container"
      ref={containerRef}
      style={{ width: loaded ? displaySize.w : '100%', height: loaded ? displaySize.h : 'auto' }}
    >
      {src && (
        <img
          ref={imgRef}
          src={src}
          alt="Crop"
          style={{
            width: loaded ? displaySize.w : '100%',
            height: loaded ? displaySize.h : 'auto',
            display: 'block',
          }}
          draggable={false}
        />
      )}
      {loaded && crop.size > 0 && (
        <div
          className="cropper-shade"
          style={{
            position: 'absolute',
            inset: 0,
            clipPath: `polygon(
              0% 0%, 100% 0%, 100% 100%, 0% 100%,
              0% 0%,
              ${crop.x}px 0,
              ${crop.x}px ${crop.y}px,
              ${crop.x + crop.size}px ${crop.y}px,
              ${crop.x + crop.size}px ${crop.y + crop.size}px,
              ${crop.x}px ${crop.y + crop.size}px,
              ${crop.x}px ${crop.y}px,
              0 ${crop.y}px
            )`,
          }}
        />
      )}
      {loaded && crop.size > 0 && (
        <div
          ref={selRef}
          className="cropper-selection"
          style={{
            left: crop.x,
            top: crop.y,
            width: crop.size,
            height: crop.size,
          }}
        >
          <div className="cropper-handle cropper-handle-nw" />
          <div className="cropper-handle cropper-handle-ne" />
          <div className="cropper-handle cropper-handle-sw" />
          <div className="cropper-handle cropper-handle-se" />
        </div>
      )}
    </div>
  )
})

export default ImageCropper

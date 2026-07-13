import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'

const HANDLE_SIZE = 20

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max)
}

const ImageCropper = forwardRef(function ImageCropper({ src, aspectRatio = 1 }, ref) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const imgRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const [imgNatural, setImgNatural] = useState({ w: 0, h: 0 })
  const [crop, setCrop] = useState({ x: 0, y: 0, size: 0 })
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 })
  const [dragging, setDragging] = useState(null)
  const dragStartRef = useRef({ x: 0, y: 0, crop: { x: 0, y: 0, size: 0 } })

  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      imgRef.current = img
      setImgNatural({ w: img.naturalWidth, h: img.naturalHeight })
      setLoaded(true)
    }
    img.src = src
  }, [src])

  useEffect(() => {
    if (!loaded || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const cw = rect.width
    const ch = rect.height
    setContainerSize({ w: cw, h: ch })

    const imageAspect = imgNatural.w / imgNatural.h
    let displayW, displayH
    if (imageAspect > 1) {
      displayW = cw
      displayH = cw / imageAspect
    } else {
      displayH = ch
      displayW = ch * imageAspect
    }

    const size = Math.min(displayW, displayH) * 0.8
    const x = (cw - size) / 2
    const y = (ch - size) / 2
    setCrop({ x, y, size })
  }, [loaded, imgNatural])

  function scaleToDisplay(natW, natH) {
    const cw = containerSize.w
    const ch = containerSize.h
    const imageAspect = natW / natH
    let displayW, displayH
    if (imageAspect > 1) {
      displayW = cw
      displayH = cw / imageAspect
    } else {
      displayH = ch
      displayW = ch * imageAspect
    }
    const offsetX = (cw - displayW) / 2
    const offsetY = (ch - displayH) / 2
    return { displayW, displayH, offsetX, offsetY }
  }

  function cropToImageCoords() {
    const { displayW, displayH, offsetX, offsetY } = scaleToDisplay(imgNatural.w, imgNatural.h)
    const scaleX = imgNatural.w / displayW
    const scaleY = imgNatural.h / displayH
    return {
      sx: (crop.x - offsetX) * scaleX,
      sy: (crop.y - offsetY) * scaleY,
      sSize: crop.size * scaleX,
    }
  }

  useImperativeHandle(ref, () => ({
    getCroppedImage() {
      const { sx, sy, sSize } = cropToImageCoords()
      const size = Math.round(sSize)
      const c = document.createElement('canvas')
      c.width = size
      c.height = size
      const ctx = c.getContext('2d')
      ctx.drawImage(imgRef.current, Math.round(sx), Math.round(sy), size, size, 0, 0, size, size)
      return c.toDataURL('image/jpeg', 0.9)
    },
  }))

  function getPointerPos(e) {
    const rect = containerRef.current.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  function handlePointerDown(e, type) {
    e.preventDefault()
    e.stopPropagation()
    setDragging(type)
    const pos = getPointerPos(e)
    dragStartRef.current = { x: pos.x, y: pos.y, crop: { ...crop } }
  }

  useEffect(() => {
    if (!dragging) return

    function onMove(e) {
      const pos = getPointerPos(e)
      const dx = pos.x - dragStartRef.current.x
      const dy = pos.y - dragStartRef.current.y
      const start = dragStartRef.current.crop

      if (dragging === 'move') {
        setCrop(prev => ({
          ...prev,
          x: clamp(start.x + dx, 0, containerSize.w - prev.size),
          y: clamp(start.y + dy, 0, containerSize.h - prev.size),
        }))
      } else if (dragging === 'resize') {
        const newSize = clamp(start.size + dx, 40, Math.min(containerSize.w, containerSize.h))
        setCrop(prev => ({
          ...prev,
          size: newSize,
          x: clamp(prev.x, 0, containerSize.w - newSize),
          y: clamp(prev.y, 0, containerSize.h - newSize),
        }))
      }
    }

    function onUp() {
      setDragging(null)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [dragging, containerSize])

  const { displayW, displayH, offsetX, offsetY } = loaded
    ? scaleToDisplay(imgNatural.w, imgNatural.h)
    : { displayW: 0, displayH: 0, offsetX: 0, offsetY: 0 }

  return (
    <div className="cropper-container" ref={containerRef}>
      {src && (
        <img
          src={src}
          alt="Crop"
          className="cropper-image"
          style={{
            width: loaded ? displayW : '100%',
            height: loaded ? displayH : 'auto',
            marginLeft: offsetX,
            marginTop: offsetY,
          }}
          draggable={false}
        />
      )}
      {loaded && crop.size > 0 && (
        <>
          <div
            className="cropper-overlay"
            style={{
              left: 0,
              top: 0,
              width: containerSize.w,
              height: containerSize.h,
            }}
          >
            <div
              className="cropper-shade"
              style={{
                clipPath: `polygon(
                  0% 0%,
                  100% 0%,
                  100% 100%,
                  0% 100%,
                  0% 0%,
                  ${crop.x}px 0%,
                  ${crop.x}px ${crop.y}px,
                  ${crop.x + crop.size}px ${crop.y}px,
                  ${crop.x + crop.size}px ${crop.y + crop.size}px,
                  ${crop.x}px ${crop.y + crop.size}px,
                  ${crop.x}px ${crop.y}px,
                  0% ${crop.y}px
                )`,
              }}
            />
          </div>
          <div
            className="cropper-selection"
            style={{
              left: crop.x,
              top: crop.y,
              width: crop.size,
              height: crop.size,
            }}
            onPointerDown={(e) => handlePointerDown(e, 'move')}
          >
            <div className="cropper-handle cropper-handle-nw" onPointerDown={(e) => { e.stopPropagation(); handlePointerDown(e, 'resize') }} />
            <div className="cropper-handle cropper-handle-ne" onPointerDown={(e) => { e.stopPropagation(); handlePointerDown(e, 'resize') }} />
            <div className="cropper-handle cropper-handle-sw" onPointerDown={(e) => { e.stopPropagation(); handlePointerDown(e, 'resize') }} />
            <div className="cropper-handle cropper-handle-se" onPointerDown={(e) => { e.stopPropagation(); handlePointerDown(e, 'resize') }} />
          </div>
        </>
      )}
    </div>
  )
})

export default ImageCropper

"use client"

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react"
import { PenTool, RotateCcw, Trash2, Sparkles } from "lucide-react"

// SVG path data for the calligraphic "Sanjay" signature and the dot over 'j'
const SANJAY_MAIN_PATH =
  "M 56 26 " +
  "C 48 16, 26 20, 22 35 " +
  "C 18 49, 46 53, 48 68 " +
  "C 50 84, 24 91, 14 82 " +
  "C 8 76, 16 64, 30 62 " +
  "C 44 60, 56 54, 64 49 " +
  "C 68 46, 61 45, 57 52 " +
  "C 53 59, 57 66, 64 62 " +
  "C 70 58, 74 49, 75 49 " +
  "C 76 49, 74 63, 79 63 " +
  "C 84 63, 89 51, 94 50 " +
  "C 98 49, 98 63, 103 63 " +
  "C 108 63, 113 51, 118 50 " +
  "C 122 49, 121 63, 127 63 " +
  "C 134 63, 142 52, 146 48 " +
  "C 148 56, 146 79, 139 94 " +
  "C 133 106, 121 106, 123 95 " +
  "C 125 83, 145 71, 162 61 " +
  "C 172 55, 179 49, 184 49 " +
  "C 180 48, 172 53, 171 60 " +
  "C 170 65, 177 65, 183 58 " +
  "C 187 53, 189 49, 189 49 " +
  "C 189 49, 188 63, 194 63 " +
  "C 200 63, 206 52, 211 50 " +
  "C 214 55, 213 62, 218 62 " +
  "C 224 62, 231 52, 236 50 " +
  "C 237 64, 232 88, 222 101 " +
  "C 214 111, 203 107, 209 94 " +
  "C 216 79, 246 66, 286 60 " +
  "C 314 56, 342 55, 362 55"

const SANJAY_DOT_PATH = "M 149 36 C 150 35.5, 151.5 36.5, 150.5 37.5"

// Cubic ease-in-out for organic pen acceleration and deceleration
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

type Mode = "auto" | "freehand"

interface ApprovedBySanjayProps {
  refCode?: string
  headerTitle?: string
  headerSubtitle?: string
  signerName?: string
  autoPlayOnMount?: boolean
}

interface StagePoint {
  x: number
  y: number
  pressure: number
}

/**
 * ApprovedBySanjay Component
 *
 * Renders the dark minimalist card with an animated "Sanjay" signature
 * and optional freehand pen / stylus / touch overlay drawing.
 */
export function ApprovedBySanjay({
  refCode = "#042",
  headerTitle = "Details",
  headerSubtitle = "Making Software",
  signerName = "SANJAY",
  autoPlayOnMount = true,
}: ApprovedBySanjayProps) {
  const [mode, setMode] = useState<Mode>("auto")
  const [isAnimating, setIsAnimating] = useState(false)
  const [hasSigned, setHasSigned] = useState(false)
  const [hasFreehandInk, setHasFreehandInk] = useState(false)
  const [statusText, setStatusText] = useState(
    "Ready — Tap pen or box to sign"
  )

  const mainPathRef = useRef<SVGPathElement>(null)
  const dotPathRef = useRef<SVGPathElement>(null)
  const nibRef = useRef<SVGGElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animFrameRef = useRef<number | null>(null)

  // Freehand drawing state refs
  const isDrawingRef = useRef(false)
  const lastPointRef = useRef<StagePoint | null>(null)
  const lastTimeRef = useRef(0)
  const lineWidthRef = useRef(2.5)

  // Reset SVG DOM elements only — no setState calls, safe to call from effects
  const resetSvgDom = useCallback(() => {
    try {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current)
        animFrameRef.current = null
      }
      if (mainPathRef.current) {
        const len = mainPathRef.current.getTotalLength()
        mainPathRef.current.style.strokeDasharray = `${len}`
        mainPathRef.current.style.strokeDashoffset = `${len}`
      }
      if (dotPathRef.current) {
        const dotLen = dotPathRef.current.getTotalLength()
        dotPathRef.current.style.strokeDasharray = `${dotLen}`
        dotPathRef.current.style.strokeDashoffset = `${dotLen}`
      }
      if (nibRef.current) {
        nibRef.current.setAttribute("opacity", "0")
      }
    } catch (err) {
      console.error("Error resetting SVG signature paths:", err)
    }
  }, [])

  // Animate "Sanjay" stroke-by-stroke with a live pen tip indicator
  const triggerSignatureAnimation = useCallback(() => {
    try {
      if (mode === "freehand") {
        setMode("auto")
        setHasFreehandInk(false)
      }

      const mainEl = mainPathRef.current
      const dotEl = dotPathRef.current
      const nibEl = nibRef.current

      if (!mainEl || !dotEl) return

      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current)
      }

      const mainLength = mainEl.getTotalLength()
      const dotLength = dotEl.getTotalLength()

      mainEl.style.strokeDasharray = `${mainLength}`
      mainEl.style.strokeDashoffset = `${mainLength}`
      dotEl.style.strokeDasharray = `${dotLength}`
      dotEl.style.strokeDashoffset = `${dotLength}`

      setIsAnimating(true)
      setStatusText(`Signing ${signerName}...`)

      if (nibEl) nibEl.setAttribute("opacity", "1")

      const mainDuration = 1750
      const dotDelay = 120
      const dotDuration = 180
      const startTime = performance.now()

      const animateStep = (now: number) => {
        const elapsed = now - startTime

        if (elapsed <= mainDuration) {
          const progress = Math.min(elapsed / mainDuration, 1)
          const eased = easeInOutCubic(progress)
          const drawLen = mainLength * eased

          mainEl.style.strokeDashoffset = `${mainLength - drawLen}`

          if (nibEl) {
            const pt = mainEl.getPointAtLength(drawLen)
            nibEl.setAttribute("transform", `translate(${pt.x}, ${pt.y})`)
          }

          animFrameRef.current = requestAnimationFrame(animateStep)
        } else if (elapsed <= mainDuration + dotDelay) {
          mainEl.style.strokeDashoffset = "0"

          if (nibEl) {
            const startDot = dotEl.getPointAtLength(0)
            nibEl.setAttribute(
              "transform",
              `translate(${startDot.x}, ${startDot.y})`
            )
          }

          animFrameRef.current = requestAnimationFrame(animateStep)
        } else if (elapsed <= mainDuration + dotDelay + dotDuration) {
          const dotElapsed = elapsed - (mainDuration + dotDelay)
          const dotProgress = Math.min(dotElapsed / dotDuration, 1)
          const dotDrawLen = dotLength * dotProgress

          dotEl.style.strokeDashoffset = `${dotLength - dotDrawLen}`

          if (nibEl) {
            const pt = dotEl.getPointAtLength(dotDrawLen)
            nibEl.setAttribute("transform", `translate(${pt.x}, ${pt.y})`)
          }

          animFrameRef.current = requestAnimationFrame(animateStep)
        } else {
          mainEl.style.strokeDashoffset = "0"
          dotEl.style.strokeDashoffset = "0"

          if (nibEl) nibEl.setAttribute("opacity", "0")

          setIsAnimating(false)
          setHasSigned(true)
          setStatusText(`Signed by ${signerName} — Tap to replay`)
        }
      }

      animFrameRef.current = requestAnimationFrame(animateStep)
    } catch (err) {
      console.error("Signature animation failed:", err)
      setIsAnimating(false)
    }
  }, [mode, signerName])

  // Size freehand overlay canvas for high-DPI / Retina displays
  const syncCanvasResolution = useCallback(() => {
    try {
      const canvas = canvasRef.current
      const stage = stageRef.current

      if (!canvas || !stage) return

      const rect = stage.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1

      canvas.width = Math.max(1, Math.floor(rect.width * dpr))
      canvas.height = Math.max(1, Math.floor(rect.height * dpr))

      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        ctx.strokeStyle = "#fafafa"
      }
    } catch (err) {
      console.error("Canvas resize error:", err)
    }
  }, [])

  // Switch between automated "Sanjay" animation and freehand pen/touch canvas
  const handleToggleMode = () => {
    if (mode === "auto") {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current)
      }
      setIsAnimating(false)
      setHasFreehandInk(false)
      setMode("freehand")
      setStatusText("Freehand Pen Mode — Draw with stylus, touch, or mouse")
      requestAnimationFrame(() => {
        syncCanvasResolution()
      })
    } else {
      setMode("auto")
      setHasFreehandInk(false)
      setStatusText("Ready — Tap pen or box to sign")
      requestAnimationFrame(() => {
        triggerSignatureAnimation()
      })
    }
  }

  // Clear freehand overlay strokes
  const handleClearCanvas = (e: React.MouseEvent) => {
    e.stopPropagation()
    const canvas = canvasRef.current
    const stage = stageRef.current

    if (!canvas || !stage) return

    const ctx = canvas.getContext("2d")
    const rect = stage.getBoundingClientRect()
    ctx?.clearRect(0, 0, rect.width, rect.height)

    setHasFreehandInk(false)
    setStatusText("Cleared — Draw your signature again")
  }

  // Convert pointer event into stage-local coordinates
  const getStagePointer = (e: React.PointerEvent): StagePoint => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      pressure: e.pressure && e.pressure > 0 ? e.pressure : 0.5,
    }
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (mode !== "freehand") return
    e.preventDefault()
    e.stopPropagation()

    const canvas = canvasRef.current
    if (!canvas) return

    canvas.setPointerCapture(e.pointerId)
    isDrawingRef.current = true
    setHasFreehandInk(true)
    setStatusText("Signing in freehand mode...")

    const pt = getStagePointer(e)
    lastPointRef.current = pt
    lastTimeRef.current = performance.now()

    const initialWidth =
      e.pointerType === "pen" ? Math.max(1.4, pt.pressure * 4.2) : 2.5
    lineWidthRef.current = initialWidth

    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.beginPath()
      ctx.fillStyle = "#fafafa"
      ctx.arc(pt.x, pt.y, initialWidth / 2, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (mode !== "freehand" || !isDrawingRef.current || !lastPointRef.current) {
      return
    }
    e.preventDefault()
    e.stopPropagation()

    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    const pt = getStagePointer(e)
    const now = performance.now()
    const dt = Math.max(now - lastTimeRef.current, 1)
    const dist = Math.hypot(
      pt.x - lastPointRef.current.x,
      pt.y - lastPointRef.current.y
    )
    const velocity = dist / dt

    let targetWidth: number
    if (e.pointerType === "pen" && e.pressure > 0) {
      targetWidth = Math.max(1.2, Math.min(4.8, pt.pressure * 4.6))
    } else {
      targetWidth = Math.max(1.4, Math.min(3.4, 3.1 - velocity * 0.65))
    }

    lineWidthRef.current = lineWidthRef.current * 0.7 + targetWidth * 0.3

    const midX = (lastPointRef.current.x + pt.x) / 2
    const midY = (lastPointRef.current.y + pt.y) / 2

    ctx.beginPath()
    ctx.lineWidth = lineWidthRef.current
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y)
    ctx.quadraticCurveTo(
      lastPointRef.current.x,
      lastPointRef.current.y,
      midX,
      midY
    )
    ctx.stroke()

    lastPointRef.current = pt
    lastTimeRef.current = now
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return
    isDrawingRef.current = false
    lastPointRef.current = null
    setStatusText("Signed — Draw more or press Clear")

    const canvas = canvasRef.current
    if (canvas && e?.pointerId && canvas.hasPointerCapture(e.pointerId)) {
      canvas.releasePointerCapture(e.pointerId)
    }
  }

  // Initial setup: reset SVG DOM, then optionally auto-play
  useEffect(() => {
    // resetSvgDom only touches refs/DOM — no setState — so it's safe here
    resetSvgDom()

    if (!autoPlayOnMount) return

    const timer = setTimeout(() => {
      triggerSignatureAnimation()
    }, 400)

    return () => {
      clearTimeout(timer)
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current)
      }
    }
    // triggerSignatureAnimation is intentionally omitted: it reads `mode` state
    // which is "auto" on mount and never changes before this effect runs.
    // Including it would cause unwanted re-runs on mode toggle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlayOnMount, resetSvgDom])

  // Cancel any in-flight animation frame on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current)
      }
    }
  }, [])

  // Keep freehand overlay canvas crisp on viewport resize
  useEffect(() => {
    if (mode !== "freehand") return

    syncCanvasResolution()
    window.addEventListener("resize", syncCanvasResolution)
    return () => window.removeEventListener("resize", syncCanvasResolution)
  }, [mode, syncCanvasResolution])

  const showPrompt =
    mode === "freehand" ? !hasFreehandInk : !hasSigned && !isAnimating

  return (
    <div className="w-full max-w-lg bg-[#09090b] border border-[#27272a] rounded-xl overflow-hidden text-zinc-100 shadow-2xl shadow-black/80">
      {/* Top Details Header */}
      <div className="px-6 sm:px-8 pt-6 pb-7 border-b border-[#27272a] flex items-start justify-between gap-4">
        <div className="space-y-2 font-mono">
          <h3 className="text-lg sm:text-xl font-normal tracking-tight text-zinc-100">
            {headerTitle}
          </h3>
          <p className="text-lg sm:text-xl font-normal tracking-tight text-zinc-100">
            {headerSubtitle}
          </p>
        </div>

        {/* Pen Sign Trigger Button */}
        <button
          type="button"
          onClick={triggerSignatureAnimation}
          aria-label={`Sign ${signerName} with pen`}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 active:scale-95 border border-[#27272a] hover:border-zinc-600 text-xs font-mono text-zinc-200 transition-all cursor-pointer"
        >
          <PenTool className="size-3.5 text-zinc-100" />
          <span>{isAnimating ? "Signing..." : "Sign"}</span>
        </button>
      </div>

      {/* Split Two-Column Approval Section */}
      <div className="grid grid-cols-12 border-b border-[#27272a] min-h-[220px]">
        {/* Left Narrow Column */}
        <div className="col-span-3 border-r border-[#27272a] p-4 flex flex-col justify-between bg-[#09090b]">
          <div className="space-y-1">
            <span className="block text-[10px] font-mono uppercase tracking-widest text-zinc-600">
              ID
            </span>
            <span className="block text-xs font-mono text-zinc-500">
              {refCode}
            </span>
          </div>
          <span className="inline-block w-fit text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
            {mode === "freehand" ? "FREEHAND" : "AUTO"}
          </span>
        </div>

        {/* Right Main Signature Column */}
        <div className="col-span-9 p-6 sm:p-7 flex flex-col justify-between bg-[#09090b]">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-mono font-medium uppercase tracking-[0.2em] text-[#a1a1aa]">
              APPROVED BY
            </span>
            {(hasSigned || hasFreehandInk) && (
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                VERIFIED
              </span>
            )}
          </div>

          {/* Interactive Signature Stage */}
          <div
            ref={stageRef}
            role="button"
            tabIndex={0}
            onClick={() => {
              if (mode === "auto") triggerSignatureAnimation()
            }}
            onKeyDown={(e) => {
              if (mode === "auto" && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault()
                triggerSignatureAnimation()
              }
            }}
            aria-label={`Signature area for ${signerName}`}
            className="relative w-full h-28 my-2 flex items-center justify-start rounded-lg select-none cursor-pointer hover:bg-zinc-900/30 transition-colors"
          >
            {showPrompt && (
              <div className="absolute inset-0 flex items-center gap-2 text-zinc-600 pointer-events-none">
                <PenTool className="size-3.5 opacity-75" />
                <span className="text-xs font-mono">
                  {mode === "freehand"
                    ? "Draw with stylus, touch, or mouse..."
                    : "Touch with pen to sign..."}
                </span>
              </div>
            )}

            {/* Animated Calligraphic "Sanjay" SVG */}
            <svg
              viewBox="0 0 380 115"
              className={`size-full max-w-[330px] overflow-visible pointer-events-none transition-opacity ${
                mode === "freehand" ? "opacity-25" : "opacity-100"
              }`}
              aria-hidden="true"
            >
              <defs>
                <filter
                  id="sanjayNibGlow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <path
                ref={mainPathRef}
                d={SANJAY_MAIN_PATH}
                fill="none"
                stroke="#fafafa"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                ref={dotPathRef}
                d={SANJAY_DOT_PATH}
                fill="none"
                stroke="#fafafa"
                strokeWidth="3.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Pen Tip Indicator */}
              <g ref={nibRef} opacity="0" filter="url(#sanjayNibGlow)">
                <circle cx="0" cy="0" r="3" fill="#ffffff" />
                <path
                  d="M 0 0 L 11 -14 L 15 -10 Z"
                  fill="#e4e4e7"
                  stroke="#09090b"
                  strokeWidth="0.75"
                />
              </g>
            </svg>

            {/* Freehand Pen / Stylus / Touch Overlay Canvas */}
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              style={{ touchAction: mode === "freehand" ? "none" : "auto" }}
              className={`absolute inset-0 size-full ${
                mode === "freehand"
                  ? "block cursor-crosshair z-10"
                  : "hidden pointer-events-none"
              }`}
            />
          </div>

          {/* Horizontal Divider + Bold Printed Name */}
          <div>
            <div className="w-full h-px bg-[#27272a] mb-3" />
            <div className="flex items-center justify-between gap-2">
              <p className="font-sans font-bold text-base sm:text-lg tracking-[0.06em] uppercase text-zinc-100">
                {signerName}
              </p>
              <span className="text-[11px] font-mono text-zinc-600 truncate">
                {statusText}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar: Replay, Pen Overlay Toggle, Clear */}
      <div className="px-4 sm:px-6 py-3 bg-[#09090b] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={triggerSignatureAnimation}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-mono text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 border border-transparent hover:border-[#27272a] transition-colors cursor-pointer"
          >
            <RotateCcw className="size-3.5" />
            <span>Replay</span>
          </button>

          <button
            type="button"
            onClick={handleToggleMode}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-mono border transition-colors cursor-pointer ${
              mode === "freehand"
                ? "text-emerald-400 bg-emerald-950/30 border-emerald-800/60"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 border-transparent hover:border-[#27272a]"
            }`}
          >
            <Sparkles className="size-3.5" />
            <span>
              {mode === "freehand" ? "Auto Signature" : "Freehand Pen"}
            </span>
          </button>

          {mode === "freehand" && (
            <button
              type="button"
              onClick={handleClearCanvas}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-mono text-zinc-400 hover:text-rose-400 hover:bg-zinc-900 border border-transparent hover:border-[#27272a] transition-colors cursor-pointer"
            >
              <Trash2 className="size-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>

        <span className="hidden sm:inline text-[11px] font-mono text-zinc-600">
          &lt;ApprovedBySanjay /&gt;
        </span>
      </div>
    </div>
  )
}

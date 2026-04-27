'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, RotateCcw } from 'lucide-react'

const W = 480, H = 320
const PAD_W = 10, PAD_H = 60, PAD_SPEED = 5
const BALL_R = 7

export default function PongPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const state = useRef({
    ball: { x: W/2, y: H/2, vx: 4, vy: 3 },
    p1: { y: H/2 - PAD_H/2 },
    p2: { y: H/2 - PAD_H/2 },
    score: { p1: 0, p2: 0 },
    running: false,
    keys: {} as Record<string, boolean>,
  })
  const [score, setScore] = useState({ p1: 0, p2: 0 })
  const [phase, setPhase] = useState<'idle' | 'playing'>('idle')
  const rafRef = useRef<number>(0)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const s = state.current

    ctx.fillStyle = '#050508'
    ctx.fillRect(0, 0, W, H)

    // Center line
    ctx.setLineDash([8, 8])
    ctx.strokeStyle = 'rgba(124,58,237,0.2)'
    ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(W/2, 0); ctx.lineTo(W/2, H); ctx.stroke()
    ctx.setLineDash([])

    // Paddles
    const pg = (x: number) => {
      const g = ctx.createLinearGradient(x, 0, x + PAD_W, 0)
      g.addColorStop(0, '#7c3aed'); g.addColorStop(1, '#6d28d9')
      return g
    }
    ctx.fillStyle = pg(10)
    ctx.beginPath(); ctx.roundRect(10, s.p1.y, PAD_W, PAD_H, 4); ctx.fill()
    ctx.fillStyle = pg(W - 20)
    ctx.beginPath(); ctx.roundRect(W - 20, s.p2.y, PAD_W, PAD_H, 4); ctx.fill()

    // Ball
    const bg = ctx.createRadialGradient(s.ball.x, s.ball.y, 1, s.ball.x, s.ball.y, BALL_R)
    bg.addColorStop(0, '#06b6d4'); bg.addColorStop(1, '#0891b2')
    ctx.fillStyle = bg
    ctx.beginPath(); ctx.arc(s.ball.x, s.ball.y, BALL_R, 0, Math.PI * 2); ctx.fill()

    // Glow
    ctx.shadowColor = '#06b6d4'
    ctx.shadowBlur = 15
    ctx.beginPath(); ctx.arc(s.ball.x, s.ball.y, BALL_R, 0, Math.PI * 2); ctx.fill()
    ctx.shadowBlur = 0
  }, [])

  const loop = useCallback(() => {
    const s = state.current
    if (!s.running) return

    // Move paddles
    if (s.keys['w'] || s.keys['W']) s.p1.y = Math.max(0, s.p1.y - PAD_SPEED)
    if (s.keys['s'] || s.keys['S']) s.p1.y = Math.min(H - PAD_H, s.p1.y + PAD_SPEED)
    if (s.keys['ArrowUp']) s.p2.y = Math.max(0, s.p2.y - PAD_SPEED)
    if (s.keys['ArrowDown']) s.p2.y = Math.min(H - PAD_H, s.p2.y + PAD_SPEED)

    // Move ball
    s.ball.x += s.ball.vx
    s.ball.y += s.ball.vy

    // Wall bounce
    if (s.ball.y - BALL_R < 0 || s.ball.y + BALL_R > H) s.ball.vy *= -1

    // Paddle collision
    if (s.ball.x - BALL_R < 20 && s.ball.y > s.p1.y && s.ball.y < s.p1.y + PAD_H) {
      s.ball.vx = Math.abs(s.ball.vx) * 1.05
      s.ball.vy += (s.ball.y - (s.p1.y + PAD_H/2)) * 0.1
    }
    if (s.ball.x + BALL_R > W - 20 && s.ball.y > s.p2.y && s.ball.y < s.p2.y + PAD_H) {
      s.ball.vx = -Math.abs(s.ball.vx) * 1.05
      s.ball.vy += (s.ball.y - (s.p2.y + PAD_H/2)) * 0.1
    }

    // Score
    if (s.ball.x < 0) {
      s.score.p2++
      setScore({ ...s.score })
      s.ball = { x: W/2, y: H/2, vx: 4, vy: 3 }
    }
    if (s.ball.x > W) {
      s.score.p1++
      setScore({ ...s.score })
      s.ball = { x: W/2, y: H/2, vx: -4, vy: 3 }
    }

    // Cap speed
    s.ball.vx = Math.max(-12, Math.min(12, s.ball.vx))
    s.ball.vy = Math.max(-10, Math.min(10, s.ball.vy))

    draw()
    rafRef.current = requestAnimationFrame(loop)
  }, [draw])

  const start = useCallback(() => {
    const s = state.current
    s.running = true
    s.ball = { x: W/2, y: H/2, vx: 4, vy: 3 }
    s.score = { p1: 0, p2: 0 }
    setScore({ p1: 0, p2: 0 })
    setPhase('playing')
    rafRef.current = requestAnimationFrame(loop)
  }, [loop])

  useEffect(() => {
    draw()
    const s = state.current
    const kd = (e: KeyboardEvent) => { s.keys[e.key] = true; if (['ArrowUp','ArrowDown'].includes(e.key)) e.preventDefault() }
    const ku = (e: KeyboardEvent) => { s.keys[e.key] = false }
    window.addEventListener('keydown', kd)
    window.addEventListener('keyup', ku)
    return () => { window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); cancelAnimationFrame(rafRef.current) }
  }, [draw])

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-slate-500 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-2xl font-bold text-white">🏓 Pong</h1>
        </div>
        <button onClick={() => { cancelAnimationFrame(rafRef.current); state.current.running = false; start() }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0d0d14] border border-[#1e1e2e] hover:border-violet-500/40 text-slate-400 hover:text-white text-sm transition-all">
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      <div className="flex justify-center gap-8 mb-4">
        <div className="text-center">
          <div className="text-xs text-slate-500 mb-1">P1 (W/S)</div>
          <div className="text-3xl font-bold text-violet-400">{score.p1}</div>
        </div>
        <div className="text-slate-600 text-2xl font-bold self-center">:</div>
        <div className="text-center">
          <div className="text-xs text-slate-500 mb-1">P2 (↑/↓)</div>
          <div className="text-3xl font-bold text-cyan-400">{score.p2}</div>
        </div>
      </div>

      <div className="relative rounded-2xl overflow-hidden neon-border">
        <canvas ref={canvasRef} width={W} height={H} className="block w-full" />
        {phase === 'idle' && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#050508]/70 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center">
              <div className="text-5xl mb-3">🏓</div>
              <div className="text-xl font-bold text-white mb-2">Pong</div>
              <div className="text-slate-400 text-sm mb-4">P1: W/S · P2: ↑/↓</div>
              <button onClick={start} className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm transition-all">
                Mulai
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

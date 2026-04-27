'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, RotateCcw } from 'lucide-react'

const W = 400, H = 480
const PAD_W = 70, PAD_H = 10, PAD_Y = H - 30
const BALL_R = 7, BALL_SPEED = 5
const ROWS = 5, COLS = 8
const BRICK_W = (W - 20) / COLS, BRICK_H = 20

const BRICK_COLORS = ['#7c3aed','#6d28d9','#2563eb','#0891b2','#059669']

interface Brick { x: number; y: number; alive: boolean; color: string }

function makeBricks(): Brick[] {
  return Array.from({ length: ROWS * COLS }, (_, i) => {
    const r = Math.floor(i / COLS), c = i % COLS
    return { x: 10 + c * BRICK_W, y: 40 + r * (BRICK_H + 4), alive: true, color: BRICK_COLORS[r] }
  })
}

export default function BreakoutPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const state = useRef({
    ball: { x: W/2, y: H/2, vx: BALL_SPEED, vy: -BALL_SPEED },
    pad: { x: W/2 - PAD_W/2 },
    bricks: makeBricks(),
    score: 0,
    lives: 3,
    running: false,
    dead: false,
    won: false,
    mouse: W/2,
  })
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [phase, setPhase] = useState<'idle' | 'playing' | 'dead' | 'won'>('idle')
  const rafRef = useRef<number>(0)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const s = state.current

    ctx.fillStyle = '#050508'
    ctx.fillRect(0, 0, W, H)

    // Bricks
    s.bricks.forEach(b => {
      if (!b.alive) return
      ctx.fillStyle = b.color
      ctx.beginPath(); ctx.roundRect(b.x + 1, b.y + 1, BRICK_W - 2, BRICK_H - 2, 3); ctx.fill()
      ctx.fillStyle = 'rgba(255,255,255,0.15)'
      ctx.beginPath(); ctx.roundRect(b.x + 2, b.y + 2, BRICK_W - 4, 4, 2); ctx.fill()
    })

    // Paddle
    const pg = ctx.createLinearGradient(s.pad.x, 0, s.pad.x + PAD_W, 0)
    pg.addColorStop(0, '#7c3aed'); pg.addColorStop(1, '#06b6d4')
    ctx.fillStyle = pg
    ctx.beginPath(); ctx.roundRect(s.pad.x, PAD_Y, PAD_W, PAD_H, 5); ctx.fill()

    // Ball
    ctx.shadowColor = '#06b6d4'; ctx.shadowBlur = 15
    ctx.fillStyle = '#06b6d4'
    ctx.beginPath(); ctx.arc(s.ball.x, s.ball.y, BALL_R, 0, Math.PI * 2); ctx.fill()
    ctx.shadowBlur = 0

    // HUD
    ctx.fillStyle = 'rgba(255,255,255,0.6)'
    ctx.font = '13px Plus Jakarta Sans, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(`Score: ${s.score}`, 10, 20)
    ctx.textAlign = 'right'
    ctx.fillText(`Lives: ${'❤️'.repeat(s.lives)}`, W - 10, 20)
  }, [])

  const loop = useCallback(() => {
    const s = state.current
    if (!s.running) return

    // Move pad to mouse
    s.pad.x += (s.mouse - PAD_W/2 - s.pad.x) * 0.15
    s.pad.x = Math.max(0, Math.min(W - PAD_W, s.pad.x))

    s.ball.x += s.ball.vx
    s.ball.y += s.ball.vy

    // Wall
    if (s.ball.x - BALL_R < 0 || s.ball.x + BALL_R > W) s.ball.vx *= -1
    if (s.ball.y - BALL_R < 0) s.ball.vy *= -1

    // Paddle
    if (s.ball.y + BALL_R > PAD_Y && s.ball.y + BALL_R < PAD_Y + PAD_H + 5 &&
      s.ball.x > s.pad.x && s.ball.x < s.pad.x + PAD_W) {
      s.ball.vy = -Math.abs(s.ball.vy)
      s.ball.vx += ((s.ball.x - (s.pad.x + PAD_W/2)) / (PAD_W/2)) * 2
    }

    // Bricks
    s.bricks.forEach(b => {
      if (!b.alive) return
      if (s.ball.x > b.x && s.ball.x < b.x + BRICK_W && s.ball.y - BALL_R < b.y + BRICK_H && s.ball.y + BALL_R > b.y) {
        b.alive = false
        s.ball.vy *= -1
        s.score += 10
        setScore(s.score)
      }
    })

    // Win
    if (s.bricks.every(b => !b.alive)) {
      s.running = false; s.won = true; setPhase('won'); return
    }

    // Fall
    if (s.ball.y > H + 20) {
      s.lives--
      setLives(s.lives)
      if (s.lives <= 0) { s.running = false; s.dead = true; setPhase('dead'); return }
      s.ball = { x: W/2, y: H/2, vx: BALL_SPEED, vy: -BALL_SPEED }
    }

    draw()
    rafRef.current = requestAnimationFrame(loop)
  }, [draw])

  const start = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    const s = state.current
    s.ball = { x: W/2, y: H/2, vx: BALL_SPEED, vy: -BALL_SPEED }
    s.pad = { x: W/2 - PAD_W/2 }
    s.bricks = makeBricks()
    s.score = 0; s.lives = 3; s.running = true; s.dead = false; s.won = false
    setScore(0); setLives(3); setPhase('playing')
    rafRef.current = requestAnimationFrame(loop)
  }, [loop])

  useEffect(() => {
    draw()
    const canvas = canvasRef.current
    const mm = (e: MouseEvent) => {
      const rect = canvas!.getBoundingClientRect()
      state.current.mouse = (e.clientX - rect.left) * (W / rect.width)
    }
    const tm = (e: TouchEvent) => {
      const rect = canvas!.getBoundingClientRect()
      state.current.mouse = (e.touches[0].clientX - rect.left) * (W / rect.width)
    }
    canvas?.addEventListener('mousemove', mm)
    canvas?.addEventListener('touchmove', tm)
    return () => { canvas?.removeEventListener('mousemove', mm); canvas?.removeEventListener('touchmove', tm); cancelAnimationFrame(rafRef.current) }
  }, [draw])

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-slate-500 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-2xl font-bold text-white">🧱 Breakout</h1>
        </div>
        <button onClick={start} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0d0d14] border border-[#1e1e2e] hover:border-violet-500/40 text-slate-400 hover:text-white text-sm transition-all">
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      <div className="relative rounded-2xl overflow-hidden neon-border">
        <canvas ref={canvasRef} width={W} height={H} className="block w-full" />
        {phase === 'idle' && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#050508]/70 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center">
              <div className="text-5xl mb-3">🧱</div>
              <div className="text-xl font-bold text-white mb-2">Breakout</div>
              <div className="text-slate-400 text-sm mb-4">Gerakkan mouse untuk kontrol paddle</div>
              <button onClick={start} className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm transition-all">Mulai</button>
            </motion.div>
          </div>
        )}
        {(phase === 'dead' || phase === 'won') && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#050508]/70 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center">
              <div className="text-5xl mb-3">{phase === 'won' ? '🎉' : '💀'}</div>
              <div className="text-xl font-bold text-white mb-1">{phase === 'won' ? 'Menang!' : 'Game Over'}</div>
              <div className="text-slate-400 mb-4">Score: <span className="text-violet-400 font-bold">{score}</span></div>
              <button onClick={start} className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm transition-all">Main Lagi</button>
            </motion.div>
          </div>
        )}
      </div>
      <p className="text-center text-slate-600 text-sm mt-3">Gerakkan mouse di atas canvas</p>
    </div>
  )
}

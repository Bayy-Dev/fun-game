'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, RotateCcw } from 'lucide-react'

const W = 360, H = 480
const BIRD_X = 80, BIRD_R = 14
const GRAVITY = 0.5, JUMP = -9
const PIPE_W = 50, GAP = 130, PIPE_SPEED = 2.5

interface Pipe { x: number; top: number }

export default function FlappyPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const state = useRef({
    bird: { y: H / 2, vy: 0 },
    pipes: [] as Pipe[],
    score: 0,
    frame: 0,
    running: false,
    dead: false,
  })
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'playing' | 'dead'>('idle')
  const rafRef = useRef<number>(0)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const s = state.current

    // Sky
    const sky = ctx.createLinearGradient(0, 0, 0, H)
    sky.addColorStop(0, '#050508')
    sky.addColorStop(1, '#0d0d14')
    ctx.fillStyle = sky
    ctx.fillRect(0, 0, W, H)

    // Grid
    ctx.strokeStyle = 'rgba(124,58,237,0.04)'
    ctx.lineWidth = 1
    for (let x = 0; x < W; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke() }
    for (let y = 0; y < H; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }

    // Pipes
    s.pipes.forEach(p => {
      const grad = ctx.createLinearGradient(p.x, 0, p.x + PIPE_W, 0)
      grad.addColorStop(0, '#16a34a')
      grad.addColorStop(1, '#15803d')
      ctx.fillStyle = grad
      ctx.beginPath(); ctx.roundRect(p.x, 0, PIPE_W, p.top, [0, 0, 6, 6]); ctx.fill()
      ctx.beginPath(); ctx.roundRect(p.x, p.top + GAP, PIPE_W, H - p.top - GAP, [6, 6, 0, 0]); ctx.fill()
    })

    // Bird
    const bx = BIRD_X, by = s.bird.y
    ctx.save()
    ctx.translate(bx, by)
    ctx.rotate(Math.min(Math.max(s.bird.vy * 0.05, -0.5), 1))
    const bg = ctx.createRadialGradient(0, 0, 2, 0, 0, BIRD_R)
    bg.addColorStop(0, '#fbbf24')
    bg.addColorStop(1, '#d97706')
    ctx.fillStyle = bg
    ctx.beginPath(); ctx.arc(0, 0, BIRD_R, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#fff'
    ctx.beginPath(); ctx.arc(5, -4, 4, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#1e1e2e'
    ctx.beginPath(); ctx.arc(6, -4, 2, 0, Math.PI * 2); ctx.fill()
    ctx.restore()

    // Score
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ctx.font = 'bold 28px Plus Jakarta Sans, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(String(s.score), W / 2, 50)
  }, [])

  const loop = useCallback(() => {
    const s = state.current
    if (!s.running) return

    s.bird.vy += GRAVITY
    s.bird.y += s.bird.vy
    s.frame++

    // Spawn pipes
    if (s.frame % 90 === 0) {
      const top = 60 + Math.random() * (H - GAP - 120)
      s.pipes.push({ x: W, top })
    }

    // Move pipes
    s.pipes.forEach(p => { p.x -= PIPE_SPEED })
    s.pipes = s.pipes.filter(p => p.x > -PIPE_W)

    // Score
    s.pipes.forEach(p => {
      if (Math.floor(p.x + PIPE_SPEED) === BIRD_X && p.x < BIRD_X) {
        s.score++
        setScore(s.score)
      }
    })

    // Collision
    const by = s.bird.y
    if (by - BIRD_R < 0 || by + BIRD_R > H) { die(); return }
    for (const p of s.pipes) {
      if (BIRD_X + BIRD_R > p.x && BIRD_X - BIRD_R < p.x + PIPE_W) {
        if (by - BIRD_R < p.top || by + BIRD_R > p.top + GAP) { die(); return }
      }
    }

    draw()
    rafRef.current = requestAnimationFrame(loop)
  }, [draw])

  const die = useCallback(() => {
    const s = state.current
    s.running = false
    s.dead = true
    setBest(b => Math.max(b, s.score))
    setPhase('dead')
    draw()
  }, [draw])

  const jump = useCallback(() => {
    const s = state.current
    if (s.dead) return
    if (!s.running) {
      s.running = true
      setPhase('playing')
      rafRef.current = requestAnimationFrame(loop)
    }
    s.bird.vy = JUMP
  }, [loop])

  const reset = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    state.current = { bird: { y: H / 2, vy: 0 }, pipes: [], score: 0, frame: 0, running: false, dead: false }
    setScore(0)
    setPhase('idle')
    draw()
  }, [draw])

  useEffect(() => {
    draw()
    const handleKey = (e: KeyboardEvent) => { if (e.code === 'Space') { e.preventDefault(); jump() } }
    window.addEventListener('keydown', handleKey)
    return () => { window.removeEventListener('keydown', handleKey); cancelAnimationFrame(rafRef.current) }
  }, [draw, jump])

  return (
    <div className="max-w-sm mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-slate-500 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-2xl font-bold text-white">🐦 Flappy Bird</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-amber-400 font-medium">Best: {best}</span>
          <button onClick={reset} className="p-2 rounded-xl bg-[#0d0d14] border border-[#1e1e2e] hover:border-violet-500/40 text-slate-400 hover:text-white transition-all">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="relative rounded-2xl overflow-hidden neon-border cursor-pointer" onClick={jump}>
        <canvas ref={canvasRef} width={W} height={H} className="block w-full" />
        {phase === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050508]/70 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center">
              <div className="text-5xl mb-3">🐦</div>
              <div className="text-xl font-bold text-white mb-2">Flappy Bird</div>
              <div className="text-slate-400 text-sm mb-4">Tap / Space untuk terbang</div>
              <div className="px-6 py-2.5 rounded-xl bg-violet-600 text-white font-medium text-sm">Tap untuk mulai</div>
            </motion.div>
          </div>
        )}
        {phase === 'dead' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050508]/70 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center">
              <div className="text-5xl mb-3">💥</div>
              <div className="text-xl font-bold text-white mb-1">Game Over</div>
              <div className="text-slate-400 mb-4">Score: <span className="text-violet-400 font-bold">{score}</span></div>
              <button onClick={e => { e.stopPropagation(); reset() }} className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm transition-all">
                Main Lagi
              </button>
            </motion.div>
          </div>
        )}
      </div>
      <p className="text-center text-slate-600 text-sm mt-3">Tap layar atau tekan Space</p>
    </div>
  )
}

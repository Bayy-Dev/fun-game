'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, RotateCcw, Trophy } from 'lucide-react'

const GRID = 20
const CELL = 20
const SPEED = 120

type Dir = { x: number; y: number }
type Point = { x: number; y: number }

const rand = () => ({ x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) })

export default function SnakePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({
    snake: [{ x: 10, y: 10 }],
    dir: { x: 1, y: 0 } as Dir,
    nextDir: { x: 1, y: 0 } as Dir,
    food: rand(),
    score: 0,
    running: false,
    dead: false,
  })
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [dead, setDead] = useState(false)
  const [started, setStarted] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const s = stateRef.current

    ctx.fillStyle = '#050508'
    ctx.fillRect(0, 0, GRID * CELL, GRID * CELL)

    // Grid
    ctx.strokeStyle = 'rgba(124,58,237,0.05)'
    ctx.lineWidth = 0.5
    for (let i = 0; i <= GRID; i++) {
      ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, GRID * CELL); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(GRID * CELL, i * CELL); ctx.stroke()
    }

    // Food
    const gf = ctx.createRadialGradient(
      s.food.x * CELL + CELL / 2, s.food.y * CELL + CELL / 2, 2,
      s.food.x * CELL + CELL / 2, s.food.y * CELL + CELL / 2, CELL / 2
    )
    gf.addColorStop(0, '#f59e0b')
    gf.addColorStop(1, '#d97706')
    ctx.fillStyle = gf
    ctx.beginPath()
    ctx.arc(s.food.x * CELL + CELL / 2, s.food.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2)
    ctx.fill()

    // Snake
    s.snake.forEach((seg, i) => {
      const alpha = 1 - (i / s.snake.length) * 0.5
      ctx.fillStyle = i === 0 ? `rgba(124,58,237,${alpha})` : `rgba(139,92,246,${alpha * 0.8})`
      ctx.beginPath()
      ctx.roundRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2, 4)
      ctx.fill()
    })
  }, [])

  const tick = useCallback(() => {
    const s = stateRef.current
    if (!s.running) return

    s.dir = s.nextDir
    const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y }

    if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID ||
      s.snake.some(seg => seg.x === head.x && seg.y === head.y)) {
      s.running = false
      s.dead = true
      setDead(true)
      setBest(prev => Math.max(prev, s.score))
      return
    }

    s.snake.unshift(head)
    if (head.x === s.food.x && head.y === s.food.y) {
      s.score++
      setScore(s.score)
      s.food = rand()
    } else {
      s.snake.pop()
    }
    draw()
  }, [draw])

  const start = useCallback(() => {
    const s = stateRef.current
    s.snake = [{ x: 10, y: 10 }]
    s.dir = { x: 1, y: 0 }
    s.nextDir = { x: 1, y: 0 }
    s.food = rand()
    s.score = 0
    s.running = true
    s.dead = false
    setScore(0)
    setDead(false)
    setStarted(true)
    draw()
  }, [draw])

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(tick, SPEED)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [tick])

  useEffect(() => {
    draw()
  }, [draw])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const s = stateRef.current
      const map: Record<string, Dir> = {
        ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
        w: { x: 0, y: -1 }, s: { x: 0, y: 1 },
        a: { x: -1, y: 0 }, d: { x: 1, y: 0 },
      }
      const newDir = map[e.key]
      if (newDir && !(newDir.x === -s.dir.x && newDir.y === -s.dir.y)) {
        e.preventDefault()
        s.nextDir = newDir
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/" className="text-slate-500 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-white">🐍 Snake</h1>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-4">
          <div className="px-4 py-2 rounded-xl bg-[#0d0d14] border border-[#1e1e2e]">
            <div className="text-xs text-slate-500">Score</div>
            <div className="text-xl font-bold text-violet-400">{score}</div>
          </div>
          <div className="px-4 py-2 rounded-xl bg-[#0d0d14] border border-[#1e1e2e]">
            <div className="text-xs text-slate-500 flex items-center gap-1"><Trophy className="w-3 h-3" /> Best</div>
            <div className="text-xl font-bold text-amber-400">{best}</div>
          </div>
        </div>
        <button
          onClick={start}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          {started ? 'Restart' : 'Mulai'}
        </button>
      </div>

      <div className="relative rounded-2xl overflow-hidden neon-border">
        <canvas
          ref={canvasRef}
          width={GRID * CELL}
          height={GRID * CELL}
          className="block w-full"
          style={{ imageRendering: 'pixelated' }}
        />

        {(!started || dead) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050508]/80 backdrop-blur-sm">
            {dead ? (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
                <div className="text-5xl mb-3">💀</div>
                <div className="text-2xl font-bold text-white mb-1">Game Over</div>
                <div className="text-slate-400 mb-4">Score: <span className="text-violet-400 font-bold">{score}</span></div>
                <button onClick={start} className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition-all">
                  Main Lagi
                </button>
              </motion.div>
            ) : (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
                <div className="text-5xl mb-3">🐍</div>
                <div className="text-xl font-bold text-white mb-4">Siap main?</div>
                <button onClick={start} className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition-all">
                  Mulai Game
                </button>
              </motion.div>
            )}
          </div>
        )}
      </div>

      <p className="text-center text-slate-600 text-sm mt-4">
        Gunakan Arrow Keys atau WASD untuk bergerak
      </p>
    </div>
  )
}

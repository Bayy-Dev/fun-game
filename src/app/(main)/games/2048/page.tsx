'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, RotateCcw } from 'lucide-react'

type Grid = (number | null)[][]

const SIZE = 4

function empty(): Grid {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(null))
}

function addRandom(grid: Grid): Grid {
  const g = grid.map(r => [...r])
  const empties: [number, number][] = []
  g.forEach((row, r) => row.forEach((v, c) => { if (!v) empties.push([r, c]) }))
  if (!empties.length) return g
  const [r, c] = empties[Math.floor(Math.random() * empties.length)]
  g[r][c] = Math.random() < 0.9 ? 2 : 4
  return g
}

function slideRow(row: (number | null)[]): { row: (number | null)[]; score: number } {
  const nums = row.filter(Boolean) as number[]
  let score = 0
  const merged: number[] = []
  let i = 0
  while (i < nums.length) {
    if (i + 1 < nums.length && nums[i] === nums[i + 1]) {
      merged.push(nums[i] * 2)
      score += nums[i] * 2
      i += 2
    } else {
      merged.push(nums[i])
      i++
    }
  }
  while (merged.length < SIZE) merged.push(0)
  return { row: merged.map(v => v || null), score }
}

function move(grid: Grid, dir: string): { grid: Grid; score: number; moved: boolean } {
  let g = grid.map(r => [...r])
  let total = 0
  let moved = false

  const rotate = (g: Grid) => g[0].map((_, i) => g.map(r => r[i]).reverse())
  const rotateBack = (g: Grid) => g[0].map((_, i) => g.map(r => r[SIZE - 1 - i]))

  if (dir === 'ArrowUp') g = rotate(g)
  if (dir === 'ArrowRight') g = g.map(r => [...r].reverse())
  if (dir === 'ArrowDown') { g = rotate(g); g = g.map(r => [...r].reverse()) }

  g = g.map(row => {
    const { row: newRow, score } = slideRow(row)
    total += score
    if (newRow.some((v, i) => v !== row[i])) moved = true
    return newRow
  })

  if (dir === 'ArrowUp') g = rotateBack(g)
  if (dir === 'ArrowRight') g = g.map(r => [...r].reverse())
  if (dir === 'ArrowDown') { g = g.map(r => [...r].reverse()); g = rotateBack(g) }

  return { grid: g, score: total, moved }
}

const COLORS: Record<number, string> = {
  2: 'bg-slate-700 text-slate-200',
  4: 'bg-slate-600 text-slate-100',
  8: 'bg-orange-600 text-white',
  16: 'bg-orange-500 text-white',
  32: 'bg-red-500 text-white',
  64: 'bg-red-600 text-white',
  128: 'bg-yellow-500 text-white',
  256: 'bg-yellow-400 text-white',
  512: 'bg-violet-500 text-white',
  1024: 'bg-violet-600 text-white',
  2048: 'bg-cyan-400 text-white',
}

export default function Game2048() {
  const [grid, setGrid] = useState<Grid>(() => addRandom(addRandom(empty())))
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [won, setWon] = useState(false)

  const reset = () => {
    setGrid(addRandom(addRandom(empty())))
    setScore(0)
    setWon(false)
  }

  const handleMove = useCallback((dir: string) => {
    setGrid(prev => {
      const { grid: next, score: s, moved } = move(prev, dir)
      if (!moved) return prev
      setScore(sc => {
        const ns = sc + s
        setBest(b => Math.max(b, ns))
        return ns
      })
      const withNew = addRandom(next)
      if (withNew.flat().includes(2048)) setWon(true)
      return withNew
    })
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) {
        e.preventDefault()
        handleMove(e.key)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleMove])

  return (
    <div className="max-w-sm mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/" className="text-slate-500 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-white">🔢 2048</h1>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-3">
          <div className="px-3 py-2 rounded-xl bg-[#0d0d14] border border-[#1e1e2e] text-center min-w-[70px]">
            <div className="text-xs text-slate-500">Score</div>
            <div className="text-lg font-bold text-violet-400">{score}</div>
          </div>
          <div className="px-3 py-2 rounded-xl bg-[#0d0d14] border border-[#1e1e2e] text-center min-w-[70px]">
            <div className="text-xs text-slate-500">Best</div>
            <div className="text-lg font-bold text-amber-400">{best}</div>
          </div>
        </div>
        <button onClick={reset} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all">
          <RotateCcw className="w-4 h-4" /> New
        </button>
      </div>

      {won && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-center text-sm font-medium">
          🎉 2048! Kamu menang! Lanjut main atau reset.
        </motion.div>
      )}

      <div className="p-2 rounded-2xl bg-[#0d0d14] border border-[#1e1e2e]">
        <div className="grid grid-cols-4 gap-2">
          {grid.flat().map((val, i) => (
            <div
              key={i}
              className={`aspect-square rounded-xl flex items-center justify-center font-bold text-sm transition-all ${
                val ? (COLORS[val] || 'bg-violet-700 text-white') : 'bg-[#13131e]'
              }`}
            >
              {val || ''}
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-slate-600 text-sm mt-4">Gunakan Arrow Keys untuk bergerak</p>
    </div>
  )
}

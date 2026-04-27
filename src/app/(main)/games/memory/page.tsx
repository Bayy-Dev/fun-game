'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, RotateCcw, Timer } from 'lucide-react'

const EMOJIS = ['🎮','🎯','🎲','🎸','🚀','🌟','🔥','💎','🎭','🦄','🌈','⚡']

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

interface Card {
  id: number
  emoji: string
  flipped: boolean
  matched: boolean
}

export default function MemoryPage() {
  const [cards, setCards] = useState<Card[]>([])
  const [selected, setSelected] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [won, setWon] = useState(false)
  const [time, setTime] = useState(0)
  const [running, setRunning] = useState(false)

  const init = () => {
    const pairs = shuffle(EMOJIS).slice(0, 8)
    const deck = shuffle([...pairs, ...pairs].map((emoji, id) => ({
      id, emoji, flipped: false, matched: false
    })))
    setCards(deck)
    setSelected([])
    setMoves(0)
    setWon(false)
    setTime(0)
    setRunning(false)
  }

  useEffect(() => { init() }, [])

  useEffect(() => {
    if (!running) return
    const t = setInterval(() => setTime(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [running])

  const flip = (id: number) => {
    if (selected.length === 2) return
    const card = cards.find(c => c.id === id)
    if (!card || card.flipped || card.matched) return

    if (!running) setRunning(true)

    const next = cards.map(c => c.id === id ? { ...c, flipped: true } : c)
    const newSel = [...selected, id]
    setCards(next)
    setSelected(newSel)

    if (newSel.length === 2) {
      setMoves(m => m + 1)
      const [a, b] = newSel.map(sid => next.find(c => c.id === sid)!)
      if (a.emoji === b.emoji) {
        const matched = next.map(c => newSel.includes(c.id) ? { ...c, matched: true } : c)
        setCards(matched)
        setSelected([])
        if (matched.every(c => c.matched)) {
          setWon(true)
          setRunning(false)
        }
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c => newSel.includes(c.id) ? { ...c, flipped: false } : c))
          setSelected([])
        }, 800)
      }
    }
  }

  const fmt = (s: number) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/" className="text-slate-500 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-white">🃏 Memory Match</h1>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-3">
          <div className="px-3 py-2 rounded-xl bg-[#0d0d14] border border-[#1e1e2e] text-center">
            <div className="text-xs text-slate-500">Moves</div>
            <div className="text-lg font-bold text-violet-400">{moves}</div>
          </div>
          <div className="px-3 py-2 rounded-xl bg-[#0d0d14] border border-[#1e1e2e] text-center">
            <div className="text-xs text-slate-500 flex items-center gap-1"><Timer className="w-3 h-3" />Time</div>
            <div className="text-lg font-bold text-cyan-400">{fmt(time)}</div>
          </div>
        </div>
        <button onClick={init} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all">
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {cards.map(card => (
          <motion.button
            key={card.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => flip(card.id)}
            className={`aspect-square rounded-xl text-2xl flex items-center justify-center border transition-all ${
              card.matched
                ? 'border-green-500/40 bg-green-500/10'
                : card.flipped
                ? 'border-violet-500/60 bg-violet-500/10'
                : 'border-[#1e1e2e] bg-[#0d0d14] hover:border-violet-500/30 cursor-pointer'
            }`}
          >
            <AnimatePresence mode="wait">
              {card.flipped || card.matched ? (
                <motion.span key="front" initial={{ rotateY: 90 }} animate={{ rotateY: 0 }} exit={{ rotateY: 90 }}>
                  {card.emoji}
                </motion.span>
              ) : (
                <motion.span key="back" initial={{ rotateY: 90 }} animate={{ rotateY: 0 }} className="text-slate-700 text-lg">
                  ?
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {won && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 flex items-center justify-center bg-[#050508]/80 backdrop-blur-sm z-50"
          >
            <div className="neon-border rounded-2xl bg-[#0d0d14] p-8 text-center max-w-sm mx-4">
              <div className="text-5xl mb-3">🎉</div>
              <h2 className="text-2xl font-bold text-white mb-2">Selesai!</h2>
              <p className="text-slate-400 mb-1">{moves} moves · {fmt(time)}</p>
              <button onClick={init} className="mt-4 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition-all">
                Main Lagi
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

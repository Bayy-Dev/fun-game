'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, RotateCcw, Delete } from 'lucide-react'

const WORDS = ['KEREN','BAGUS','HEBAT','CEPAT','PINTU','MAKAN','MINUM','TIDUR','JALAN','BESAR','KECIL','PUTIH','HITAM','MERAH','HIJAU','BIRU','KUNING','PANAS','DINGIN','MANIS']
const WORD_LEN = 5
const MAX_TRIES = 6

type LetterState = 'correct' | 'present' | 'absent' | 'empty' | 'active'

function getStates(guess: string, answer: string): LetterState[] {
  const result: LetterState[] = Array(WORD_LEN).fill('absent')
  const ansArr = answer.split('')
  const used = Array(WORD_LEN).fill(false)

  // Correct first
  guess.split('').forEach((l, i) => {
    if (l === ansArr[i]) { result[i] = 'correct'; used[i] = true }
  })
  // Present
  guess.split('').forEach((l, i) => {
    if (result[i] === 'correct') return
    const j = ansArr.findIndex((a, ai) => a === l && !used[ai])
    if (j !== -1) { result[i] = 'present'; used[j] = true }
  })
  return result
}

const COLORS: Record<LetterState, string> = {
  correct: 'bg-green-600 border-green-500 text-white',
  present: 'bg-yellow-600 border-yellow-500 text-white',
  absent: 'bg-[#1e1e2e] border-[#2a2a3e] text-slate-400',
  empty: 'bg-transparent border-[#1e1e2e] text-white',
  active: 'bg-transparent border-violet-500/60 text-white',
}

const KEYBOARD = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM']

export default function WordlePage() {
  const [answer] = useState(() => WORDS[Math.floor(Math.random() * WORDS.length)])
  const [guesses, setGuesses] = useState<string[]>([])
  const [current, setCurrent] = useState('')
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)

  const submit = () => {
    if (current.length !== WORD_LEN) return
    const next = [...guesses, current]
    setGuesses(next)
    setCurrent('')
    if (current === answer) { setWon(true); setGameOver(true) }
    else if (next.length >= MAX_TRIES) setGameOver(true)
  }

  const type = (l: string) => {
    if (gameOver || current.length >= WORD_LEN) return
    setCurrent(c => c + l)
  }

  const del = () => setCurrent(c => c.slice(0, -1))

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') submit()
      else if (e.key === 'Backspace') del()
      else if (/^[A-Za-z]$/.test(e.key)) type(e.key.toUpperCase())
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [current, gameOver])

  // Letter states for keyboard
  const letterStates: Record<string, LetterState> = {}
  guesses.forEach(g => {
    getStates(g, answer).forEach((s, i) => {
      const l = g[i]
      if (!letterStates[l] || s === 'correct' || (s === 'present' && letterStates[l] === 'absent')) {
        letterStates[l] = s
      }
    })
  })

  const rows = Array.from({ length: MAX_TRIES }, (_, i) => {
    if (i < guesses.length) return { letters: guesses[i].split(''), states: getStates(guesses[i], answer) }
    if (i === guesses.length && !gameOver) return { letters: current.split(''), states: null }
    return { letters: [], states: null }
  })

  return (
    <div className="max-w-sm mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-slate-500 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-2xl font-bold text-white">📝 Word Guess</h1>
        </div>
        <button onClick={() => window.location.reload()} className="p-2 rounded-xl bg-[#0d0d14] border border-[#1e1e2e] hover:border-violet-500/40 text-slate-400 hover:text-white transition-all">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {gameOver && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`mb-4 p-3 rounded-xl text-center text-sm font-medium border ${won ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
          {won ? '🎉 Benar! Kamu menang!' : `😢 Jawabannya: ${answer}`}
        </motion.div>
      )}

      {/* Grid */}
      <div className="flex flex-col gap-1.5 mb-6">
        {rows.map((row, ri) => (
          <div key={ri} className="flex gap-1.5 justify-center">
            {Array.from({ length: WORD_LEN }, (_, ci) => {
              const letter = row.letters[ci] || ''
              const state: LetterState = row.states ? row.states[ci] : (letter ? 'active' : 'empty')
              return (
                <motion.div
                  key={ci}
                  animate={row.states && row.states[ci] ? { rotateX: [0, 90, 0] } : {}}
                  transition={{ delay: ci * 0.1, duration: 0.4 }}
                  className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center font-bold text-lg transition-all ${COLORS[state]}`}
                >
                  {letter}
                </motion.div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Keyboard */}
      <div className="flex flex-col gap-1.5 items-center">
        {KEYBOARD.map(row => (
          <div key={row} className="flex gap-1">
            {row.split('').map(l => (
              <button
                key={l}
                onClick={() => type(l)}
                className={`w-8 h-10 rounded-lg text-xs font-bold transition-all border ${
                  letterStates[l] ? COLORS[letterStates[l]] : 'bg-[#13131e] border-[#1e1e2e] text-slate-300 hover:border-violet-500/40'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        ))}
        <div className="flex gap-1 mt-1">
          <button onClick={del} className="px-3 h-10 rounded-lg bg-[#13131e] border border-[#1e1e2e] text-slate-300 hover:border-violet-500/40 transition-all">
            <Delete className="w-4 h-4" />
          </button>
          <button onClick={submit} className="px-4 h-10 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all">
            ENTER
          </button>
        </div>
      </div>
    </div>
  )
}

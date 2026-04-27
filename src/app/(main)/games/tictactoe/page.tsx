'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, RotateCcw } from 'lucide-react'

type Cell = 'X' | 'O' | null

const WINS = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6],
]

function checkWinner(board: Cell[]): { winner: Cell; line: number[] } | null {
  for (const line of WINS) {
    const [a, b, c] = line
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line }
    }
  }
  return null
}

export default function TicTacToePage() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null))
  const [turn, setTurn] = useState<'X' | 'O'>('X')
  const [scores, setScores] = useState({ X: 0, O: 0 })

  const result = checkWinner(board)
  const isDraw = !result && board.every(Boolean)

  const handleClick = (i: number) => {
    if (board[i] || result || isDraw) return
    const next = [...board]
    next[i] = turn
    setBoard(next)
    const win = checkWinner(next)
    if (win) {
      setScores(s => ({ ...s, [turn]: s[turn as 'X' | 'O'] + 1 }))
    } else {
      setTurn(t => t === 'X' ? 'O' : 'X')
    }
  }

  const reset = () => {
    setBoard(Array(9).fill(null))
    setTurn('X')
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/" className="text-slate-500 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-white">⭕ Tic Tac Toe</h1>
      </div>

      {/* Scores */}
      <div className="flex gap-4 mb-6">
        {(['X', 'O'] as const).map(p => (
          <div key={p} className={`flex-1 py-3 rounded-xl text-center border transition-all ${
            turn === p && !result && !isDraw
              ? 'border-violet-500/60 bg-violet-500/10'
              : 'border-[#1e1e2e] bg-[#0d0d14]'
          }`}>
            <div className={`text-2xl font-bold ${p === 'X' ? 'text-cyan-400' : 'text-pink-400'}`}>{p}</div>
            <div className="text-slate-400 text-sm">{scores[p]} menang</div>
          </div>
        ))}
      </div>

      {/* Board */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {board.map((cell, i) => {
          const isWinCell = result?.line.includes(i)
          return (
            <motion.button
              key={i}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleClick(i)}
              className={`aspect-square rounded-xl text-4xl font-bold flex items-center justify-center border transition-all ${
                isWinCell
                  ? 'border-violet-500 bg-violet-500/20'
                  : 'border-[#1e1e2e] bg-[#0d0d14] hover:border-violet-500/40 hover:bg-[#13131e]'
              } ${!cell && !result && !isDraw ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <AnimatePresence>
                {cell && (
                  <motion.span
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className={cell === 'X' ? 'text-cyan-400' : 'text-pink-400'}
                  >
                    {cell}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          )
        })}
      </div>

      {/* Status */}
      <div className="text-center mb-4">
        {result ? (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-xl font-bold text-white">
            🎉 Pemain <span className={result.winner === 'X' ? 'text-cyan-400' : 'text-pink-400'}>{result.winner}</span> menang!
          </motion.div>
        ) : isDraw ? (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-xl font-bold text-slate-400">
            🤝 Seri!
          </motion.div>
        ) : (
          <div className="text-slate-400">
            Giliran: <span className={turn === 'X' ? 'text-cyan-400 font-bold' : 'text-pink-400 font-bold'}>{turn}</span>
          </div>
        )}
      </div>

      <button
        onClick={reset}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0d0d14] border border-[#1e1e2e] hover:border-violet-500/40 text-slate-300 hover:text-white text-sm font-medium transition-all"
      >
        <RotateCcw className="w-4 h-4" /> Main Lagi
      </button>
    </div>
  )
}

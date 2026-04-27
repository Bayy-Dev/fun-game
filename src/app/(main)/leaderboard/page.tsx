'use client'

import { motion } from 'framer-motion'
import { Trophy, Medal, Crown } from 'lucide-react'

const mock = [
  { rank: 1, name: 'CyberGamer', score: 9420, game: 'Snake', avatar: '🦊' },
  { rank: 2, name: 'NeonPlayer', score: 8800, game: 'Flappy', avatar: '🐺' },
  { rank: 3, name: 'PixelKing', score: 7650, game: '2048', avatar: '🦁' },
  { rank: 4, name: 'GlitchMaster', score: 6200, game: 'Breakout', avatar: '🐯' },
  { rank: 5, name: 'VoidRunner', score: 5900, game: 'Snake', avatar: '🦅' },
  { rank: 6, name: 'DataHacker', score: 4800, game: 'Flappy', avatar: '🦋' },
  { rank: 7, name: 'ByteWizard', score: 3700, game: '2048', avatar: '🐉' },
  { rank: 8, name: 'CodeNinja', score: 2900, game: 'Breakout', avatar: '🦊' },
]

const rankIcon = (r: number) => {
  if (r === 1) return <Crown className="w-5 h-5 text-yellow-400" />
  if (r === 2) return <Medal className="w-5 h-5 text-slate-300" />
  if (r === 3) return <Medal className="w-5 h-5 text-amber-600" />
  return <span className="text-slate-500 font-bold text-sm w-5 text-center">{r}</span>
}

export default function LeaderboardPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-sm mb-4">
          <Trophy className="w-3.5 h-3.5" /> Top Players
        </div>
        <h1 className="text-4xl font-extrabold text-white">Leaderboard</h1>
        <p className="text-slate-500 mt-2">Siapa yang paling jago?</p>
      </motion.div>

      {/* Top 3 podium */}
      <div className="flex items-end justify-center gap-4 mb-8">
        {[mock[1], mock[0], mock[2]].map((p, i) => {
          const heights = ['h-24', 'h-32', 'h-20']
          const colors = ['bg-slate-600/20 border-slate-500/30', 'bg-yellow-500/10 border-yellow-500/30', 'bg-amber-700/20 border-amber-600/30']
          return (
            <motion.div
              key={p.rank}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex-1 flex flex-col items-center justify-end ${heights[i]} rounded-t-xl border ${colors[i]} pt-4 pb-3`}
            >
              <div className="text-2xl mb-1">{p.avatar}</div>
              <div className="text-xs font-bold text-white">{p.name}</div>
              <div className="text-xs text-slate-400">{p.score.toLocaleString()}</div>
              <div className="mt-1">{rankIcon(p.rank)}</div>
            </motion.div>
          )
        })}
      </div>

      {/* Full list */}
      <div className="space-y-2">
        {mock.map((p, i) => (
          <motion.div
            key={p.rank}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
              p.rank <= 3
                ? 'border-violet-500/20 bg-violet-500/5'
                : 'border-[#1e1e2e] bg-[#0d0d14]'
            }`}
          >
            <div className="w-6 flex justify-center">{rankIcon(p.rank)}</div>
            <div className="text-2xl">{p.avatar}</div>
            <div className="flex-1">
              <div className="font-semibold text-white text-sm">{p.name}</div>
              <div className="text-xs text-slate-500">{p.game}</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-violet-400">{p.score.toLocaleString()}</div>
              <div className="text-xs text-slate-600">pts</div>
            </div>
          </motion.div>
        ))}
      </div>

      <p className="text-center text-slate-700 text-xs mt-8">Leaderboard akan terupdate setelah sistem skor live diaktifkan.</p>
    </div>
  )
}

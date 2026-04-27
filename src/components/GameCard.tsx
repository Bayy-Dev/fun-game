'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Users, User, Flame, Sparkles } from 'lucide-react'
import type { Game } from '@/lib/games'

export default function GameCard({ game, index }: { game: Game; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: 'easeOut' }}
    >
      <Link href={game.href}>
        <div className="game-card group relative rounded-2xl overflow-hidden border border-[#1e1e2e] bg-[#0d0d14] hover:border-violet-500/40 cursor-pointer">
          {/* Gradient top bar */}
          <div className={`h-1 w-full bg-gradient-to-r ${game.color}`} />

          {/* Glow on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-5`} />
          </div>

          <div className="p-5">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className={`text-4xl p-2 rounded-xl bg-gradient-to-br ${game.color} bg-opacity-10`}>
                {game.emoji}
              </div>
              <div className="flex flex-col items-end gap-1">
                {game.hot && (
                  <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                    <Flame className="w-3 h-3" /> Hot
                  </span>
                )}
                {game.new && (
                  <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Sparkles className="w-3 h-3" /> New
                  </span>
                )}
              </div>
            </div>

            {/* Title & desc */}
            <h3 className="font-bold text-white text-lg mb-1 group-hover:text-violet-300 transition-colors">
              {game.title}
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">
              {game.description}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                {game.players.includes('2') ? (
                  <Users className="w-3.5 h-3.5" />
                ) : (
                  <User className="w-3.5 h-3.5" />
                )}
                {game.players}
              </div>
              <div className="flex gap-1">
                {game.tags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-[#13131e] text-slate-500 border border-[#1e1e2e]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
            <div className={`px-6 py-2.5 rounded-xl bg-gradient-to-r ${game.color} text-white font-bold text-sm shadow-lg`}>
              ▶ Main Sekarang
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

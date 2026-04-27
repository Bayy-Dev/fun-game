'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Zap, Trophy, Users } from 'lucide-react'
import GameCard from '@/components/GameCard'
import { games, categories } from '@/lib/games'

export default function HomePage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const filtered = games.filter(g => {
    const matchCat = activeCategory === 'all' || g.category === activeCategory
    const matchSearch = g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.description.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-16 relative">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm mb-6">
            <Zap className="w-3.5 h-3.5" />
            <span>8 Games Tersedia Sekarang</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight">
            <span className="text-white">Fun</span>
            <span className="text-glow text-violet-400">Game</span>
            <br />
            <span className="text-glow-cyan text-cyan-400">HUB</span>
          </h1>

          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
            Kumpulan game seru buat dimainkan kapan aja. Single player, multiplayer, puzzle, action — semua ada di sini.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex items-center justify-center gap-8 mt-8"
        >
          {[
            { icon: <Zap className="w-4 h-4" />, label: '8 Games', color: 'text-violet-400' },
            { icon: <Users className="w-4 h-4" />, label: 'Multiplayer', color: 'text-cyan-400' },
            { icon: <Trophy className="w-4 h-4" />, label: 'Leaderboard', color: 'text-amber-400' },
          ].map(stat => (
            <div key={stat.label} className={`flex items-center gap-2 ${stat.color} text-sm font-medium`}>
              {stat.icon}
              {stat.label}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Search & Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mb-8 space-y-4"
      >
        {/* Search */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Cari game..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="cyber-input w-full pl-10 pr-4 py-3 rounded-xl text-sm placeholder:text-slate-600"
          />
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                activeCategory === cat.id
                  ? 'bg-violet-600 border-violet-500 text-white glow-purple'
                  : 'bg-[#0d0d14] border-[#1e1e2e] text-slate-400 hover:border-violet-500/40 hover:text-white'
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Games Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((game, i) => (
            <GameCard key={game.id} game={game} index={i} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 text-slate-600"
        >
          <div className="text-5xl mb-4">🎮</div>
          <p className="text-lg">Game tidak ditemukan</p>
          <p className="text-sm mt-1">Coba kata kunci lain</p>
        </motion.div>
      )}

      {/* Footer */}
      <div className="mt-20 pt-8 border-t border-[#1e1e2e] text-center text-slate-600 text-sm">
        <p>FunGame Hub — Built with Next.js + Supabase</p>
      </div>
    </div>
  )
}

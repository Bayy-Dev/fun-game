'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Gamepad2, LogIn, LogOut, User, Menu, X, Zap } from 'lucide-react'
import { useAuth } from './AuthProvider'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1e1e2e] bg-[#050508]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <Gamepad2 className="w-7 h-7 text-violet-400 group-hover:text-violet-300 transition-colors" />
            <div className="absolute inset-0 blur-md bg-violet-500/30 group-hover:bg-violet-500/50 transition-all rounded-full" />
          </div>
          <span className="font-bold text-lg tracking-tight">
            <span className="text-white">Fun</span>
            <span className="text-violet-400">Game</span>
            <span className="text-cyan-400 text-xs ml-1 font-medium">HUB</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors">
            Games
          </Link>
          <Link href="/leaderboard" className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" /> Leaderboard
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#13131e] border border-[#1e1e2e]">
                <User className="w-3.5 h-3.5 text-violet-400" />
                <span className="text-sm text-slate-300 max-w-[120px] truncate">
                  {user.user_metadata?.username || user.email?.split('@')[0]}
                </span>
              </div>
              <button
                onClick={signOut}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                Keluar
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="px-4 py-1.5 rounded-lg text-sm text-slate-300 hover:text-white border border-[#1e1e2e] hover:border-violet-500/40 transition-all"
              >
                Masuk
              </Link>
              <Link
                href="/auth/register"
                className="btn-cyber px-4 py-1.5 rounded-lg text-sm font-medium bg-violet-600 hover:bg-violet-500 text-white transition-all glow-purple"
              >
                Daftar
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-slate-400 hover:text-white transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-[#1e1e2e] bg-[#050508]/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              <Link href="/" className="text-sm text-slate-400 hover:text-white py-2" onClick={() => setMenuOpen(false)}>
                Games
              </Link>
              <Link href="/leaderboard" className="text-sm text-slate-400 hover:text-white py-2" onClick={() => setMenuOpen(false)}>
                Leaderboard
              </Link>
              {user ? (
                <>
                  <div className="text-sm text-slate-400 py-2">
                    👤 {user.email?.split('@')[0]}
                  </div>
                  <button onClick={() => { signOut(); setMenuOpen(false) }} className="text-sm text-red-400 text-left py-2">
                    Keluar
                  </button>
                </>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Link href="/auth/login" className="flex-1 text-center px-4 py-2 rounded-lg text-sm border border-[#1e1e2e] text-slate-300" onClick={() => setMenuOpen(false)}>
                    Masuk
                  </Link>
                  <Link href="/auth/register" className="flex-1 text-center px-4 py-2 rounded-lg text-sm bg-violet-600 text-white font-medium" onClick={() => setMenuOpen(false)}>
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Gamepad2, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      setError('Password tidak cocok.')
      return
    }
    if (password.length < 6) {
      setError('Password minimal 6 karakter.')
      return
    }

    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/` },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen cyber-grid flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center neon-border rounded-2xl bg-[#0d0d14] p-10"
        >
          <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Cek Email Kamu!</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Kami kirim link konfirmasi ke <span className="text-violet-400">{email}</span>.
            Klik link itu untuk aktifkan akun kamu.
          </p>
          <Link
            href="/auth/login"
            className="inline-block mt-6 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all"
          >
            Ke Halaman Login
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen cyber-grid flex items-center justify-center px-4">
      <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/4 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="neon-border rounded-2xl bg-[#0d0d14] p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <Gamepad2 className="w-8 h-8 text-violet-400" />
              <span className="font-bold text-xl">
                <span className="text-white">Fun</span>
                <span className="text-violet-400">Game</span>
                <span className="text-cyan-400 text-sm ml-1">HUB</span>
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-white">Buat Akun</h1>
            <p className="text-slate-500 text-sm mt-1">Gratis, selamanya</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}

            <div className="space-y-1">
              <label className="text-sm text-slate-400">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="kamu@email.com"
                  required
                  className="cyber-input w-full pl-10 pr-4 py-3 rounded-xl text-sm placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-slate-400">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 6 karakter"
                  required
                  className="cyber-input w-full pl-10 pr-10 py-3 rounded-xl text-sm placeholder:text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-slate-400">Konfirmasi Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Ulangi password"
                  required
                  className="cyber-input w-full pl-10 pr-4 py-3 rounded-xl text-sm placeholder:text-slate-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-cyber w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all glow-purple mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Mendaftar...
                </span>
              ) : 'Daftar Sekarang'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Sudah punya akun?{' '}
            <Link href="/auth/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
              Masuk
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

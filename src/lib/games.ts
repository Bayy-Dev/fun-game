export type GameCategory = 'single' | 'multiplayer' | 'puzzle' | 'action' | 'casual'

export interface Game {
  id: string
  title: string
  description: string
  category: GameCategory
  players: string
  emoji: string
  color: string
  tags: string[]
  href: string
  hot?: boolean
  new?: boolean
}

export const games: Game[] = [
  {
    id: 'snake',
    title: 'Snake',
    description: 'Makan apel, jangan nabrak diri sendiri. Klasik banget.',
    category: 'single',
    players: '1 Player',
    emoji: '🐍',
    color: 'from-green-500 to-emerald-700',
    tags: ['classic', 'arcade'],
    href: '/games/snake',
    hot: true,
  },
  {
    id: 'tictactoe',
    title: 'Tic Tac Toe',
    description: 'X vs O. Siapa yang duluan bikin garis menang?',
    category: 'multiplayer',
    players: '2 Players',
    emoji: '⭕',
    color: 'from-blue-500 to-cyan-700',
    tags: ['classic', 'strategy'],
    href: '/games/tictactoe',
  },
  {
    id: 'memory',
    title: 'Memory Match',
    description: 'Temukan pasangan kartu yang sama. Uji ingatan lo.',
    category: 'puzzle',
    players: '1 Player',
    emoji: '🃏',
    color: 'from-purple-500 to-violet-700',
    tags: ['memory', 'puzzle'],
    href: '/games/memory',
    new: true,
  },
  {
    id: 'flappy',
    title: 'Flappy Bird',
    description: 'Terbang melewati pipa. Gampang keliatan, susah beneran.',
    category: 'action',
    players: '1 Player',
    emoji: '🐦',
    color: 'from-yellow-500 to-orange-600',
    tags: ['arcade', 'reflex'],
    href: '/games/flappy',
    hot: true,
  },
  {
    id: 'wordle',
    title: 'Word Guess',
    description: 'Tebak kata 5 huruf dalam 6 percobaan.',
    category: 'puzzle',
    players: '1 Player',
    emoji: '📝',
    color: 'from-teal-500 to-green-700',
    tags: ['word', 'puzzle'],
    href: '/games/wordle',
  },
  {
    id: 'pong',
    title: 'Pong',
    description: 'Ping pong digital. Duel sama temen atau AI.',
    category: 'multiplayer',
    players: '1-2 Players',
    emoji: '🏓',
    color: 'from-red-500 to-rose-700',
    tags: ['classic', 'sports'],
    href: '/games/pong',
    new: true,
  },
  {
    id: '2048',
    title: '2048',
    description: 'Gabungin angka sampai dapet 2048. Adiktif banget.',
    category: 'puzzle',
    players: '1 Player',
    emoji: '🔢',
    color: 'from-orange-500 to-amber-700',
    tags: ['math', 'strategy'],
    href: '/games/2048',
  },
  {
    id: 'breakout',
    title: 'Breakout',
    description: 'Hancurin semua bata pake bola. Arcade vibes.',
    category: 'action',
    players: '1 Player',
    emoji: '🧱',
    color: 'from-pink-500 to-fuchsia-700',
    tags: ['arcade', 'action'],
    href: '/games/breakout',
  },
]

export const categories = [
  { id: 'all', label: 'Semua', emoji: '🎮' },
  { id: 'single', label: 'Single Player', emoji: '👤' },
  { id: 'multiplayer', label: 'Multiplayer', emoji: '👥' },
  { id: 'puzzle', label: 'Puzzle', emoji: '🧩' },
  { id: 'action', label: 'Action', emoji: '⚡' },
  { id: 'casual', label: 'Casual', emoji: '😎' },
]

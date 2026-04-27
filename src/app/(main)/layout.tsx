import { AuthProvider } from '@/components/AuthProvider'
import Navbar from '@/components/Navbar'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="cyber-grid min-h-screen">
        <Navbar />
        <main className="pt-16">
          {children}
        </main>
      </div>
    </AuthProvider>
  )
}

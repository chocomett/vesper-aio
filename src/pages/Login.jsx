import { useState } from 'react'
import { User, Lock } from 'lucide-react'
import { STATIC_USERS } from '../constants/data'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const user = STATIC_USERS[username.toLowerCase()]

    if (user && user.password === password) {
      setError('')
      onLogin(user)
    } else {
      setError('Username atau password salah!')
    }
  }

  return (
    <div className="w-full max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/50 overflow-hidden flex flex-col md:flex-row">

        {/* Bagian Kiri - Informasi (Disembunyikan di Mobile) */}
        <div className="hidden md:flex w-full md:w-1/2 p-10 md:p-16 flex-col justify-center border-r border-[#0a0f1d]/10 bg-white/40">
          <h2 className="text-3xl md:text-4xl font-black text-[#0a0f1d] mb-4">
            Catatan Internal
          </h2>
          <div className="text-[#0a0f1d]/70 text-sm md:text-base leading-relaxed mb-8 space-y-4">
            <p>
              Sistem Manajemen Internal Tim Komsos. Silakan login menggunakan salah satu akun *dummy* berikut untuk melihat simulasi pembatasan akses modul:
            </p>
            <ul className="space-y-3 bg-white/40 p-4 rounded-xl border border-white/50 text-sm shadow-sm">
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#0a0f1d] min-w-[70px]">admin</span>
                <span>: Dashboard, Keuangan, Penjualan</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#0a0f1d] min-w-[70px]">komsos</span>
                <span>: Absen, Pinjam, Fullcam, Teks Misa, Penjualan</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#0a0f1d] min-w-[70px]">maint</span>
                <span>: Semua modul kecuali Dashboard & Keuangan</span>
              </li>
            </ul>
            <p className="text-xs italic text-[#0a0f1d]/50 mt-2">*Password semua akun: 123</p>
          </div>

        </div>

        {/* Bagian Kanan - Form Login */}
        <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-[#0a0f1d] tracking-widest mb-2">LOGIN</h2>
            <p className="text-[#0a0f1d]/50 text-sm">Masukkan username dan password</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-600 text-sm p-3 rounded-xl mb-6 text-center font-medium animate-in shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#0a0f1d]/70 uppercase tracking-wider mb-2 ml-1">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-[#0a0f1d]/40" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/50 border border-white/60 focus:border-[#0a0f1d]/30 focus:ring-4 focus:ring-[#0a0f1d]/10 text-[#0a0f1d] rounded-xl pl-11 pr-4 py-3.5 transition-all outline-none"
                  placeholder="admin / komsos / maint"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0a0f1d]/70 uppercase tracking-wider mb-2 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#0a0f1d]/40" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/50 border border-white/60 focus:border-[#0a0f1d]/30 focus:ring-4 focus:ring-[#0a0f1d]/10 text-[#0a0f1d] rounded-xl pl-11 pr-4 py-3.5 transition-all outline-none"
                  placeholder="password: 123"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0a0f1d] hover:bg-[#0a0f1d]/90 text-white font-bold rounded-xl py-4 mt-4 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 active:translate-y-0"
            >
              MASUK
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

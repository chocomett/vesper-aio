import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { LogOut } from 'lucide-react'

import Login from './pages/Login'
import MainMenu from './pages/MainMenu'
import DummyPage from './components/DummyPage'
import FullcamPage from './pages/FullcamPage'
import AcakPetugasPage from './pages/AcakPetugas'
import { ALL_FEATURES } from './constants/data'

const pageMap = {
  '/dashboard': <DummyPage title="Dashboard Analytics" />,
  '/absen': <DummyPage title="Easy Absen" />,
  '/inventaris': <DummyPage title="Manajemen Inventaris" />,
  '/peminjaman': <DummyPage title="Sistem Peminjaman" />,
  '/acak-petugas': <AcakPetugasPage />,
  '/penjualan': <DummyPage title="Penjualan Teks Misa" />,
  '/keuangan': <DummyPage title="Pencatatan Keuangan" />,
  '/fullcam': <FullcamPage />,
  '/template-misa': <DummyPage title="Template Teks Misa" />,
  '/wifi': <DummyPage title="Generator Voucher WiFi" />
};

function App() {
  const [user, setUser] = useState(null)

  const handleLogout = () => {
    setUser(null)
  }

  return (
    <Router>
      <div className="h-screen overflow-hidden bg-[#dbdbdb] flex flex-col items-center p-4 md:p-6 font-sans selection:bg-[#0a0f1d] selection:text-white">

        {/* Header Global */}
        <div className="w-full max-w-7xl flex justify-between items-center mb-4">
          <Link to="/" className="hover:opacity-80 transition-opacity pl-2">
            <h1 className="text-2xl md:text-3xl font-black tracking-[0.2em] text-[#0a0f1d]">
              VESPER RPD
            </h1>
          </Link>

          {user && (
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <p className="text-sm font-bold text-[#0a0f1d]">{user.name}</p>
                <p className="text-xs text-[#0a0f1d]/60 uppercase tracking-wider">{user.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-3 bg-white/40 hover:bg-red-500/10 text-[#0a0f1d] hover:text-red-600 rounded-xl transition-colors border border-transparent hover:border-red-500/20 group"
                title="Logout"
              >
                <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>

        {/* Konten Utama */}
        {!user ? (
          <div className="flex-1 w-full flex items-center justify-center -mt-20">
            <Login onLogin={setUser} />
          </div>
        ) : (
          <div className="flex-1 w-full max-w-7xl flex flex-col min-h-0">
            <Routes>
              <Route path="/" element={<MainMenu user={user} />} />
              
              {/* Dynamic Route Protection based on data.js */}
              {ALL_FEATURES.map((feature) => (
                <Route 
                  key={feature.path} 
                  path={feature.path} 
                  element={
                    feature.roles.includes(user.role) 
                      ? pageMap[feature.path] 
                      : <Navigate to="/" replace />
                  } 
                />
              ))}

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        )}

      </div>
    </Router>
  )
}

export default App

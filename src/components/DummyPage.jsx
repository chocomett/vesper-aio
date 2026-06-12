import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function DummyPage({ title }) {
  return (
    <div className="w-full h-full flex flex-col bg-white/50 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] shadow-lg border border-white/40 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-8 border-b border-[#0a0f1d]/10 pb-6 shrink-0">
        <Link 
          to="/" 
          className="p-3 bg-white/50 hover:bg-white rounded-xl shadow-sm transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5 text-[#0a0f1d]" />
        </Link>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#0a0f1d]">{title}</h2>
          <p className="text-sm text-[#0a0f1d]/50 mt-1">Modul sedang dalam tahap pengembangan.</p>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-[#0a0f1d]/20 rounded-2xl bg-white/30 min-h-0">
        <div className="w-16 h-16 mb-4 rounded-full bg-[#0a0f1d]/5 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#0a0f1d]/20 border-t-[#0a0f1d]/60 rounded-full animate-spin" />
        </div>
        <p className="text-[#0a0f1d]/60 font-medium">Data belum tersedia</p>
      </div>
    </div>
  )
}

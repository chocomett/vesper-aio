import { ArrowLeft, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DesktopWarning() {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 md:p-12 bg-white/50 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white/40 w-full max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-8 border border-red-500/20">
        <Smartphone className="w-12 h-12 text-red-600 animate-pulse" strokeWidth={1.5} />
      </div>
      
      <h2 className="text-2xl md:text-3xl font-black text-[#0a0f1d] mb-4 tracking-wide">
        Hanya Untuk Mobile
      </h2>
      
      <p className="text-[#0a0f1d]/70 mb-10 leading-relaxed text-sm md:text-base">
        Modul <span className="font-bold text-[#0a0f1d]">Fullcam</span> (Kamera Misa) ini dirancang khusus untuk pengoperasian lapangan. 
        Harap buka fitur ini menggunakan perangkat <span className="font-bold">HP atau Tablet</span> Anda.
      </p>
      
      <Link 
        to="/" 
        className="flex items-center gap-3 bg-[#0a0f1d] hover:bg-[#0a0f1d]/80 text-white px-8 py-4 rounded-xl font-bold transition-all hover:shadow-lg hover:-translate-y-1 active:translate-y-0"
      >
        <ArrowLeft className="w-5 h-5" />
        Kembali ke Menu Utama
      </Link>
    </div>
  );
}

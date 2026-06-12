import { ChevronLeft, ChevronRight, Users, Dices } from 'lucide-react';

export default function SidebarInput({
  namaBulan,
  keBulanSebelumnya,
  keBulanBerikutnya,
  teksNamaPetugas,
  setTeksNamaPetugas,
  buatJadwalAcak,
  sedangMengacak
}) {
  return (
    <div className="lg:col-span-4 flex flex-col gap-4">
      {/* Navigasi Bulan */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between shrink-0">
        <button onClick={keBulanSebelumnya} className="p-2 hover:bg-slate-100 rounded-xl text-slate-600">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bulan Jadwal</p>
          <h2 className="text-base font-black text-slate-800">{namaBulan}</h2>
        </div>
        <button onClick={keBulanBerikutnya} className="p-2 hover:bg-slate-100 rounded-xl text-slate-600">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm shrink-0">
        <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-600" /> Daftar Nama Petugas
        </h3>
        <textarea 
          className="w-full h-64 bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none text-sm placeholder:text-slate-400 font-medium"
          placeholder="Budi&#10;Sinta&#10;Andi&#10;Maria"
          value={teksNamaPetugas}
          onChange={(e) => setTeksNamaPetugas(e.target.value)}
        ></textarea>
      </div>

      <button 
        onClick={buatJadwalAcak}
        disabled={sedangMengacak || !teksNamaPetugas.trim()}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black p-4 rounded-2xl text-sm flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50 shadow-md shrink-0"
      >
        <Dices className={`w-5 h-5 ${sedangMengacak ? 'animate-spin' : ''}`} />
        {sedangMengacak ? 'MENGACAK...' : 'BUAT JADWAL 1 BULAN'}
      </button>
    </div>
  );
}

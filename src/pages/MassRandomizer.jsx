import { CalendarDays, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMassRandomizer } from '../hooks/useMassRandomizer';
import SidebarInput from '../components/MassRandomizer/SidebarInput';
import ScheduleResult from '../components/MassRandomizer/ScheduleResult';

export default function MassRandomizerPage() {
  const {
    teksNamaPetugas,
    setTeksNamaPetugas,
    namaBulan,
    keBulanSebelumnya,
    keBulanBerikutnya,
    buatJadwalAcak,
    sedangMengacak,
    jadwalBulanan,
    referensiEkspor,
    unduhGambar,
    sedangMengunduh
  } = useMassRandomizer();

  return (
    <div className="h-full bg-slate-50 text-slate-900 overflow-hidden flex flex-col rounded-3xl shadow-lg border border-slate-200">
      {/* Header Terang */}
      <div className="px-6 py-4 flex items-center justify-between bg-white border-b border-slate-200 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">Acak Petugas Misa</h1>
            <p className="text-xs text-slate-500 font-medium">Sistem Penjadwalan Cerdas</p>
          </div>
        </div>
        <div className="hidden md:flex p-2 bg-blue-50 text-blue-800 rounded-xl items-center gap-2 font-bold text-sm border border-blue-100">
          <CalendarDays className="w-4 h-4" /> Kalender Liturgi Abadi
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 h-full">
          
          <SidebarInput 
            namaBulan={namaBulan}
            keBulanSebelumnya={keBulanSebelumnya}
            keBulanBerikutnya={keBulanBerikutnya}
            teksNamaPetugas={teksNamaPetugas}
            setTeksNamaPetugas={setTeksNamaPetugas}
            buatJadwalAcak={buatJadwalAcak}
            sedangMengacak={sedangMengacak}
          />

          <ScheduleResult 
            jadwalBulanan={jadwalBulanan}
            namaBulan={namaBulan}
            buatJadwalAcak={buatJadwalAcak}
            unduhGambar={unduhGambar}
            sedangMengunduh={sedangMengunduh}
            referensiEkspor={referensiEkspor}
          />

        </div>
      </div>
    </div>
  );
}

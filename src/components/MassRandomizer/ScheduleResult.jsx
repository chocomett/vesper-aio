import { CalendarDays, RefreshCw, Download } from 'lucide-react';

const petaWarna = {
  green: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  red: 'bg-rose-50 border-rose-200 text-rose-800',
  white: 'bg-slate-100 border-slate-300 text-slate-800',
  purple: 'bg-purple-50 border-purple-200 text-purple-800',
  rose: 'bg-pink-50 border-pink-200 text-pink-800',
};

export default function ScheduleResult({
  jadwalBulanan,
  namaBulan,
  buatJadwalAcak,
  unduhGambar,
  sedangMengunduh,
  referensiEkspor
}) {
  if (!jadwalBulanan) {
    return (
      <div className="lg:col-span-8 flex flex-col lg:min-h-0 min-h-[400px] mt-4 lg:mt-0">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 h-full flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <CalendarDays className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Jadwal Bulanan Belum Dibuat</h3>
          <p className="text-slate-500 text-sm max-w-[280px]">Pilih bulan, isi nama petugas, lalu klik tombol untuk membuat jadwal otomatis selama satu bulan penuh.</p>
        </div>
      </div>
    );
  }

  const RenderPekan = ({ pekan, isExport = false }) => (
    <div key={pekan.id} className="break-inside-avoid">
      <div className={`mb-3 px-4 py-2 rounded-lg flex justify-between items-center ${petaWarna[pekan.warnaLiturgi] || petaWarna.green}`}>
        <h3 className="font-black">Pekan {pekan.id}</h3>
        <span className="text-xs font-bold uppercase tracking-wider bg-white/50 px-2 py-1 rounded">{pekan.namaLiturgi}</span>
      </div>
      
      <div className={`grid gap-4 pl-2 ${isExport ? 'grid-cols-3' : 'grid-cols-1 md:grid-cols-3'}`}>
        {pekan.sesi.map(sesi => (
          <div key={sesi.id} className={`border-l-2 border-slate-200 pl-4 ${sesi.layarPenuh ? (isExport ? 'col-span-3' : 'md:col-span-3') : ''}`}>
            <h4 className="text-xs font-bold text-slate-500 mb-2">{sesi.nama}</h4>
            <ul className={sesi.petugas.length > 3 ? `grid gap-x-8 gap-y-1 ${isExport ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'}` : "space-y-1"}>
              {sesi.petugas.map((namaPetugas, urutan) => (
                <li key={urutan} className="text-sm font-medium text-slate-800 flex items-start gap-2 break-inside-avoid">
                  <span className="text-slate-400 text-xs mt-[2px] w-3 shrink-0">{urutan + 1}.</span> {namaPetugas}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="lg:col-span-8 flex flex-col lg:min-h-0 mt-4 lg:mt-0">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col flex-1 lg:min-h-0 lg:overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0 rounded-t-3xl">
          <h3 className="font-black text-slate-800">Preview: {namaBulan}</h3>
          <div className="flex gap-2">
            <button onClick={buatJadwalAcak} className="p-2 hover:bg-slate-200 rounded-xl text-slate-600 tooltip" title="Acak Ulang">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button onClick={unduhGambar} disabled={sedangMengunduh} className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center gap-2">
              <Download className="w-4 h-4" /> {sedangMengunduh ? 'Menyimpan...' : 'Cetak PNG'}
            </button>
          </div>
        </div>

        {/* Kontainer Scrollable untuk Canvas Cetak */}
        <div className="flex-1 lg:overflow-auto p-4 md:p-8 bg-slate-200/50 rounded-b-3xl relative">
          
          {/* Element ini yang TAMPIL DI LAYAR (Responsive / Mobile Friendly) */}
          <div className="bg-white p-4 md:p-8 rounded-xl shadow-sm border border-slate-100 w-full max-w-4xl mx-auto">
            <div className="text-center mb-8 border-b-2 border-slate-100 pb-6">
              <h1 className="text-2xl font-black text-slate-900 mb-1">JADWAL PETUGAS MISA</h1>
              <h2 className="text-lg font-bold text-blue-600 uppercase tracking-widest">{namaBulan}</h2>
            </div>
            <div className="space-y-8">
              {jadwalBulanan.map((pekan) => <RenderPekan key={pekan.id} pekan={pekan} isExport={false} />)}
            </div>
            <div className="mt-12 pt-6 border-t border-slate-100 text-center text-xs font-medium text-slate-400">
              Dibuat oleh Vesper AIO &bull; Jadwal dapat berubah sewaktu-waktu.
            </div>
          </div>

          {/* Element ini SEMBUNYI tapi KHUSUS UNTUK CETAK PNG (Selalu versi Desktop / Lebar) */}
          <div className="absolute top-[-9999px] left-[-9999px]">
            <div id="schedule-export" ref={referensiEkspor} className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 w-[800px]">
              <div className="text-center mb-8 border-b-2 border-slate-100 pb-6">
                <h1 className="text-2xl font-black text-slate-900 mb-1">JADWAL PETUGAS MISA</h1>
                <h2 className="text-lg font-bold text-blue-600 uppercase tracking-widest">{namaBulan}</h2>
              </div>
              <div className="space-y-8">
                {jadwalBulanan.map((pekan) => <RenderPekan key={`export-${pekan.id}`} pekan={pekan} isExport={true} />)}
              </div>
              <div className="mt-12 pt-6 border-t border-slate-100 text-center text-xs font-medium text-slate-400">
                Dibuat oleh Vesper AIO &bull; Jadwal dapat berubah sewaktu-waktu.
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

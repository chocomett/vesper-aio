import { useState, useEffect } from 'react';
import { ArrowLeft, Search, Plus, Package, Camera, Headphones, Zap, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';

const KategoriIcon = ({ kategori }) => {
  switch(kategori) {
    case 'Kamera': return <Camera className="w-5 h-5 text-blue-500" />;
    case 'Audio': return <Headphones className="w-5 h-5 text-purple-500" />;
    case 'Kabel': return <Zap className="w-5 h-5 text-amber-500" />;
    default: return <Package className="w-5 h-5 text-slate-500" />;
  }
};

export default function InventoryPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Semua');
  const [inventoryData, setInventoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/inventaris')
      .then(res => res.json())
      .then(data => {
        setInventoryData(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Gagal mengambil data dari database:", err);
        setIsLoading(false);
      });
  }, []);

  const categories = ['Semua', 'Kamera', 'Lensa', 'Audio', 'Kabel', 'Lighting'];

  const filteredData = inventoryData.filter(item => {
    const matchSearch = item.nama_barang.toLowerCase().includes(search.toLowerCase()) || item.kode_barang.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'Semua' || item.kategori === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="h-full w-full bg-slate-50 text-slate-900 overflow-hidden flex flex-col rounded-3xl shadow-lg border border-slate-200">
      
      {/* Header */}
      <div className="px-4 py-4 md:px-6 md:py-5 flex flex-col sm:flex-row sm:items-center justify-between bg-white border-b border-slate-200 shrink-0 shadow-sm z-10 gap-4">
        <div className="flex items-center gap-3 md:gap-4">
          <Link to="/" className="p-2 hover:bg-slate-100 rounded-full transition-colors shrink-0">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight leading-none mb-1">Inventaris Komsos</h1>
            <p className="text-xs text-slate-500 font-medium">Monitoring Real-time & Peminjaman</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm shadow-blue-200">
            <Plus className="w-4 h-4" /> Tambah Barang
          </button>
        </div>
      </div>

      {/* Konten Utama */}
      <div className="flex-1 overflow-auto flex flex-col">
        
        {/* Search & Filter Bar */}
        <div className="bg-white px-4 md:px-6 py-4 border-b border-slate-100 shrink-0 space-y-3 md:space-y-0 md:flex md:items-center md:justify-between gap-4 sticky top-0 z-10 shadow-sm shadow-slate-100/50">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari nama atau kode barang..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
          
          <div className="flex overflow-x-auto pb-1 md:pb-0 gap-2 hide-scrollbar">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors border ${
                  filter === cat 
                    ? 'bg-slate-800 border-slate-800 text-white' 
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Compact List Barang */}
        <div className="flex-1 p-4 md:p-6 bg-slate-50/50">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            
            {/* Table Header (Hanya di Desktop) */}
            <div className="hidden sm:flex items-center px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500">
              <div className="flex-1">NAMA BARANG & KODE</div>
              <div className="w-48">LOKASI SIMPAN</div>
              <div className="w-32 text-right pr-6">KETERSEDIAAN</div>
              <div className="w-16 text-center">AKSI</div>
            </div>

            <div className="divide-y divide-slate-100">
              {isLoading ? (
                <div className="p-8 text-center text-slate-500 font-medium">Memuat data dari database...</div>
              ) : filteredData.length === 0 ? (
                <div className="p-8 text-center text-slate-500 font-medium">Tidak ada data ditemukan.</div>
              ) : (
                filteredData.map(item => {
                  const tersedia = item.jumlah_total - item.jumlah_dipinjam;
                  const isHabis = tersedia === 0;

                  return (
                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 hover:bg-slate-50/80 transition-colors gap-3 sm:gap-4">
                      
                      {/* Info Kiri (Nama & Kategori) */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 shrink-0 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                          <KategoriIcon kategori={item.kategori} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="font-bold text-slate-800 text-sm truncate">{item.nama_barang}</h3>
                            <span className="hidden sm:inline-block px-1.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-500 rounded text-[10px] font-bold shrink-0">{item.kode_barang}</span>
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-2">
                            <span className="font-medium text-slate-600">{item.kategori}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span className="flex items-center gap-1">
                              <span className={`w-1.5 h-1.5 rounded-full ${item.kondisi === 'Baik' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                              {item.kondisi}
                            </span>
                            <span className="sm:hidden w-1 h-1 rounded-full bg-slate-300"></span>
                            <span className="sm:hidden text-slate-400 truncate">{item.lokasi_simpan}</span>
                          </div>
                        </div>
                      </div>

                      {/* Info Tengah (Lokasi) - Khusus Desktop */}
                      <div className="hidden sm:block w-48 text-xs font-medium text-slate-500 truncate pr-4">
                        {item.lokasi_simpan}
                      </div>

                      {/* Info Kanan / Status Ketersediaan */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 sm:w-auto shrink-0">
                        
                        <div className="text-left sm:text-right sm:w-32 sm:pr-6">
                          <div className="flex items-baseline gap-1 sm:justify-end">
                            <span className={`text-base font-black ${isHabis ? 'text-rose-600' : 'text-slate-800'}`}>{tersedia}</span>
                            <span className="text-xs font-bold text-slate-400">/ {item.jumlah_total}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 font-medium">
                            {item.jumlah_dipinjam > 0 ? <span className="text-amber-600 font-bold">{item.jumlah_dipinjam} dipinjam</span> : 'Tersedia'}
                          </div>
                        </div>
                        
                        {/* Action Buttons (Edit / Options) */}
                        <div className="flex items-center gap-1 w-auto sm:w-16 justify-end">
                          <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors tooltip" title="Edit Barang">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

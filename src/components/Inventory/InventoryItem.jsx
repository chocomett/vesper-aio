import { Package, Camera, Headphones, Zap, Edit2, Trash2 } from 'lucide-react';

const KategoriIcon = ({ kategori }) => {
  switch(kategori) {
    case 'Kamera': return <Camera className="w-5 h-5 text-blue-500" />;
    case 'Audio': return <Headphones className="w-5 h-5 text-purple-500" />;
    case 'Kabel': return <Zap className="w-5 h-5 text-amber-500" />;
    default: return <Package className="w-5 h-5 text-slate-500" />;
  }
};

export default function InventoryItem({ item, onEdit, onDelete }) {
  const tersedia = item.jumlah_total - item.jumlah_dipinjam;
  const isHabis = tersedia === 0;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 hover:bg-slate-50/80 transition-colors gap-3 sm:gap-4">
      
      {/* Info Kiri (Nama & Kategori) */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="w-10 h-10 shrink-0 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center">
          <KategoriIcon kategori={item.kategori} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-bold text-slate-800 text-sm truncate">{item.nama_barang}</h3>
            <span className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-500 rounded text-[10px] font-bold shrink-0">{item.kode_barang}</span>
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
        
        {/* Action Buttons (Edit / Delete) */}
        <div className="flex items-center gap-1 w-auto sm:w-20 justify-end">
          <button onClick={() => onEdit(item)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors tooltip" title="Edit Barang">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete(item.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors tooltip" title="Hapus Barang">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

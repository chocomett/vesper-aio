import InventoryItem from './InventoryItem';

export default function InventoryList({ data, isLoading }) {
  return (
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
          ) : data.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-medium">Tidak ada data ditemukan.</div>
          ) : (
            data.map(item => <InventoryItem key={item.id} item={item} />)
          )}
        </div>
      </div>
    </div>
  );
}

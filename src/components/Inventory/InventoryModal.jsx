import { useState } from 'react';

export default function InventoryModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    kode_barang: '',
    nama_barang: '',
    kategori: 'Kamera',
    kondisi: 'Baik',
    jumlah_total: 1,
    lokasi_simpan: ''
  });

  const categories = ['Kamera', 'Lensa', 'Audio', 'Kabel', 'Lighting', 'Komputer', 'Aksesoris', 'Lainnya'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onAdd(formData);
    if (success) {
      setFormData({ kode_barang: '', nama_barang: '', kategori: 'Kamera', kondisi: 'Baik', jumlah_total: 1, lokasi_simpan: '' });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-full">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h2 className="font-bold text-lg text-slate-800">Tambah Barang Baru</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-rose-500 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">KODE BARANG</label>
            <input required type="text" value={formData.kode_barang} onChange={e => setFormData({...formData, kode_barang: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" placeholder="Cth: CAM-SNY-02" />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">NAMA BARANG</label>
            <input required type="text" value={formData.nama_barang} onChange={e => setFormData({...formData, nama_barang: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" placeholder="Cth: Kamera Sony A7IV" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">KATEGORI</label>
              <select value={formData.kategori} onChange={e => setFormData({...formData, kategori: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white">
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">KONDISI</label>
              <select value={formData.kondisi} onChange={e => setFormData({...formData, kondisi: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white">
                <option value="Baik">Baik</option>
                <option value="Rusak Ringan">Rusak Ringan</option>
                <option value="Rusak Berat">Rusak Berat</option>
                <option value="Hilang">Hilang</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">JUMLAH TOTAL</label>
              <input required type="number" min="1" value={formData.jumlah_total} onChange={e => setFormData({...formData, jumlah_total: parseInt(e.target.value)})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">LOKASI SIMPAN</label>
              <input type="text" value={formData.lokasi_simpan} onChange={e => setFormData({...formData, lokasi_simpan: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" placeholder="Cth: Lemari 2" />
            </div>
          </div>

          <button type="submit" className="w-full py-3 mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-sm shadow-blue-200 transition-all">
            Simpan Barang
          </button>
        </form>
      </div>
    </div>
  );
}

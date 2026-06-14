import { useState, useEffect } from 'react';

const COMMON_SUGGESTIONS = {
  'Kamera': ['Sony A7III', 'Sony A7IV', 'Canon EOS R', 'Canon EOS R6', 'Lumix GH5', 'Lumix GH6', 'Sony FX30'],
  'Lensa': ['Sony FE 24-70mm f/2.8 GM', 'Sony FE 50mm f/1.8', 'Sony FE 70-200mm f/2.8 GM', 'Canon RF 24-105mm', 'Sigma 16mm f/1.4', 'Sigma 30mm f/1.4'],
  'Audio': ['Saramonic Blink 500', 'Rode Wireless GO II', 'Zoom H6', 'Zoom H4n', 'Mic Shure SM58', 'Boya BY-M1', 'Kabel XLR', 'Soundcard Focusrite'],
  'Kabel': ['Kabel HDMI', 'Kabel SDI', 'Kabel XLR', 'Kabel Audio 3.5mm', 'Kabel Power', 'Kabel Type-C', 'Roll Kabel'],
  'Lighting': ['Godox SL60W', 'Godox SL150W', 'Aputure Amaran 100d', 'Aputure Amaran 200x', 'Lampu LED Panel', 'Softbox 90cm', 'Stand Light'],
  'Komputer': ['MacBook Pro', 'MacBook Air', 'PC Rakitan Vmix', 'Monitor Dell', 'Keyboard Logitech', 'Mouse Wireless', 'Kabel LAN'],
  'Aksesoris': ['Tripod Takara', 'Tripod Beike', 'SD Card Sandisk 64GB', 'SD Card Sandisk 128GB', 'Baterai NP-F970', 'Dummy Battery', 'Card Reader'],
};

const DEFAULT_CATEGORIES = ['Kamera', 'Lensa', 'Audio', 'Kabel', 'Lighting', 'Komputer', 'Aksesoris', 'Lainnya'];

export default function InventoryModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    kode_barang: '',
    nama_barang: '',
    kategori: 'Kamera',
    kondisi: 'Baik',
    jumlah_total: 1,
    lokasi_simpan: ''
  });
  
  const [panjangKabel, setPanjangKabel] = useState('');

  const isEdit = !!initialData;
  const isKabel = formData.kategori.toLowerCase() === 'kabel';

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setPanjangKabel(''); // Reset panjang kabel pas edit karena mungkin udah masuk ke nama_barang/catatan
    } else {
      setFormData({ kode_barang: '', nama_barang: '', kategori: 'Kamera', kondisi: 'Baik', jumlah_total: 1, lokasi_simpan: '' });
      setPanjangKabel('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData };
    
    // Jika kabel dan ada panjangnya, tambahkan ke nama barang
    if (isKabel && panjangKabel.trim() !== '') {
      payload.nama_barang = `${payload.nama_barang.trim()} (${panjangKabel}m)`;
    }

    const success = await onSave(payload);
    if (success) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const currentSuggestions = COMMON_SUGGESTIONS[formData.kategori] || [];

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-full">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h2 className="font-bold text-lg text-slate-800">{isEdit ? 'Edit Barang' : 'Tambah Barang Baru'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-rose-500 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl">
            <span className="text-xs font-bold text-slate-500">KODE BARANG</span>
            <span className="text-sm font-black text-slate-800">
              {isEdit ? formData.kode_barang : <span className="text-slate-400 font-medium italic">Otomatis oleh sistem</span>}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">KATEGORI</label>
            <input 
              required 
              list="kategori-options"
              value={formData.kategori} 
              onChange={e => setFormData({...formData, kategori: e.target.value})} 
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" 
              placeholder="Pilih atau ketik kategori baru..."
            />
            <datalist id="kategori-options">
              {DEFAULT_CATEGORIES.map(cat => <option key={cat} value={cat} />)}
            </datalist>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">NAMA BARANG</label>
            <input 
              required 
              list="nama-barang-options"
              type="text" 
              value={formData.nama_barang} 
              onChange={e => setFormData({...formData, nama_barang: e.target.value})} 
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" 
              placeholder="Cth: Kamera Sony A7IV" 
            />
            <datalist id="nama-barang-options">
              {currentSuggestions.map(name => <option key={name} value={name} />)}
            </datalist>
          </div>

          {/* Opsi Tambahan untuk Kabel */}
          {isKabel && !isEdit && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-center gap-3">
              <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              <div className="flex-1">
                <label className="block text-xs font-bold text-amber-800 mb-1">PANJANG KABEL (Opsional)</label>
                <div className="relative">
                  <input type="number" value={panjangKabel} onChange={e => setPanjangKabel(e.target.value)} className="w-full pl-3 pr-8 py-1.5 bg-white border border-amber-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="Cth: 10" />
                  <span className="absolute right-3 top-1.5 text-sm text-slate-400 font-medium">m</span>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">KONDISI</label>
              <select value={formData.kondisi} onChange={e => setFormData({...formData, kondisi: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white">
                <option value="Baik">Baik</option>
                <option value="Rusak Ringan">Rusak Ringan</option>
                <option value="Rusak Berat">Rusak Berat</option>
                <option value="Hilang">Hilang</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">JUMLAH TOTAL</label>
              <input required type="number" min="1" value={formData.jumlah_total} onChange={e => setFormData({...formData, jumlah_total: parseInt(e.target.value)})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">LOKASI SIMPAN</label>
            <input type="text" value={formData.lokasi_simpan} onChange={e => setFormData({...formData, lokasi_simpan: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" placeholder="Cth: Lemari 2 Laci 3" />
          </div>

          <button type="submit" className="w-full py-3 mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-sm shadow-blue-200 transition-all">
            {isEdit ? 'Simpan Perubahan' : 'Simpan Barang'}
          </button>
        </form>
      </div>
    </div>
  );
}

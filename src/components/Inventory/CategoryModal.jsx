import { useState } from 'react';
import { Trash2, Plus, X } from 'lucide-react';

export default function CategoryModal({ isOpen, onClose, categories, onAdd, onDelete }) {
  const [newCat, setNewCat] = useState('');

  if (!isOpen) return null;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    const success = await onAdd(newCat);
    if (success) setNewCat('');
  };

  const handleDelete = async (id, nama) => {
    if (window.confirm(`Yakin ingin menghapus kategori "${nama}"?`)) {
      await onDelete(id);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col max-h-[80vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <h2 className="font-bold text-lg text-slate-800">Kelola Kategori</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-rose-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
          <div className="space-y-2">
            {categories.length === 0 ? (
              <p className="text-center text-slate-500 text-sm">Belum ada kategori.</p>
            ) : (
              categories.map(cat => (
                <div key={cat.id} className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm">
                  <span className="font-bold text-slate-700 text-sm">{cat.nama}</span>
                  <button onClick={() => handleDelete(cat.id, cat.nama)} className="text-slate-400 hover:text-rose-500 transition-colors p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <form onSubmit={handleAdd} className="p-4 border-t border-slate-100 bg-white shrink-0">
          <label className="block text-xs font-bold text-slate-500 mb-2">TAMBAH KATEGORI BARU</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={newCat} 
              onChange={e => setNewCat(e.target.value)} 
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" 
              placeholder="Cth: Proyektor" 
            />
            <button type="submit" disabled={!newCat.trim()} className="px-4 py-2 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white text-sm font-bold rounded-xl shadow-sm transition-all flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

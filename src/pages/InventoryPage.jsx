import { useState } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useInventory } from '../hooks/useInventory';
import InventoryToolbar from '../components/Inventory/InventoryToolbar';
import InventoryList from '../components/Inventory/InventoryList';
import InventoryModal from '../components/Inventory/InventoryModal';

const CATEGORIES = ['Semua', 'Kamera', 'Lensa', 'Audio', 'Kabel', 'Lighting', 'Komputer', 'Aksesoris', 'Lainnya'];

export default function InventoryPage() {
  const { inventoryData, isLoading, addItem } = useInventory();
  
  // UI State
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter Logic
  const filteredData = inventoryData.filter(item => {
    const matchSearch = item.nama_barang.toLowerCase().includes(search.toLowerCase()) || 
                        item.kode_barang.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'Semua' || item.kategori === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="h-full w-full bg-slate-50 text-slate-900 overflow-hidden flex flex-col rounded-3xl shadow-lg border border-slate-200 relative">
      
      {/* Header Utama */}
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
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm shadow-blue-200"
          >
            <Plus className="w-4 h-4" /> Tambah Barang
          </button>
        </div>
      </div>

      {/* Konten Utama (List & Filter) */}
      <div className="flex-1 overflow-auto flex flex-col">
        <InventoryToolbar 
          search={search} 
          setSearch={setSearch} 
          filter={filter} 
          setFilter={setFilter} 
          categories={CATEGORIES} 
        />
        
        <InventoryList 
          data={filteredData} 
          isLoading={isLoading} 
        />
      </div>

      {/* Modal Popup */}
      <InventoryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={addItem} 
      />
    </div>
  );
}

import { Search, Settings2 } from 'lucide-react';

export default function InventoryToolbar({ search, setSearch, filter, setFilter, categories, onManageCategories }) {
  return (
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
      
      <div className="flex items-center gap-2 overflow-hidden">
        <button 
          onClick={onManageCategories}
          className="p-1.5 shrink-0 bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 rounded-lg transition-colors border border-slate-200"
          title="Kelola Kategori"
        >
          <Settings2 className="w-4 h-4" />
        </button>
        <div className="w-px h-5 bg-slate-200 shrink-0 mx-1"></div>
        <div className="flex overflow-x-auto pb-1 md:pb-0 gap-2 hide-scrollbar flex-1">
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
    </div>
  );
}

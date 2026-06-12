import { Link } from 'react-router-dom'
import { ALL_FEATURES } from '../constants/data'
import { ChevronRight } from 'lucide-react'

// Palet warna cerah untuk icon box
const gradients = [
  'from-blue-500 to-cyan-400',
  'from-purple-500 to-pink-500',
  'from-emerald-500 to-teal-400',
  'from-orange-500 to-amber-400',
  'from-rose-500 to-red-500',
  'from-indigo-500 to-blue-500',
  'from-teal-500 to-emerald-400',
  'from-amber-500 to-orange-400',
]

export default function MainMenu({ user }) {
  // Filter fitur berdasarkan role user yang sedang login
  const allowedFeatures = ALL_FEATURES.filter(feature => feature.roles.includes(user.role));

  return (
    <div className="w-full h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Banner / Greeting Section */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-8 md:p-12 mb-8 text-white shadow-2xl relative overflow-hidden shrink-0 mx-2">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-black mb-2 tracking-tight">
              Selamat Datang, <span className="text-blue-400">{user.name}</span>!
            </h2>
            <p className="text-slate-300 text-sm md:text-base max-w-xl font-medium">
              Pilih modul sistem di bawah ini untuk memulai pekerjaan Anda. 
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3">
            <span className="text-xs text-slate-300 font-medium">Hak Akses:</span>
            <span className="uppercase tracking-widest font-black text-white text-xs">{user.role}</span>
          </div>
        </div>
      </div>

      {/* Grid Menu */}
      <div className="flex-1 overflow-auto pb-8 min-h-0 px-2">
        {allowedFeatures.length === 0 ? (
          <div className="text-center p-10 bg-white rounded-[2rem] shadow-sm border border-slate-200">
            <p className="text-slate-500 font-medium">Tidak ada modul yang tersedia untuk role Anda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {allowedFeatures.map((feature, index) => {
              const Icon = feature.icon;
              const gradient = gradients[index % gradients.length];
              
              return (
                <Link 
                  key={feature.path} 
                  to={feature.path}
                  className="group bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-slate-100 hover:border-blue-100 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between cursor-pointer"
                  style={{ animationFillMode: 'both', animationDelay: `${index * 50}ms` }}
                >
                  <div>
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                    </div>
                    <h3 className="font-bold text-lg text-slate-800 mb-2 tracking-tight">{feature.title}</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                  
                  <div className="mt-6 flex items-center text-blue-600 text-sm font-bold opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    Buka Modul <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

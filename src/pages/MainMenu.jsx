import { Link } from 'react-router-dom'
import { ALL_FEATURES } from '../constants/data'

export default function MainMenu({ user }) {
  // Filter fitur berdasarkan role user yang sedang login
  const allowedFeatures = ALL_FEATURES.filter(feature => feature.roles.includes(user.role));

  return (
    <div className="w-full max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 text-center md:text-left">
        <h2 className="text-xl font-semibold text-[#0a0f1d]/80">Menu Utama</h2>
        <p className="text-sm text-[#0a0f1d]/50">Modul yang tersedia untuk akses: <span className="font-bold text-[#0a0f1d]">{user.name}</span></p>
      </div>

      {allowedFeatures.length === 0 ? (
        <div className="text-center p-10 bg-white/40 rounded-3xl">
          <p className="text-[#0a0f1d]/60">Tidak ada modul yang tersedia untuk role Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {allowedFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link 
                key={feature.path} 
                to={feature.path}
                className="bg-white/40 hover:bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-white/50 flex flex-col items-center text-center group cursor-pointer"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="bg-white p-4 rounded-2xl mb-4 shadow-sm group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300">
                  <Icon className="w-7 h-7 text-[#0a0f1d]" strokeWidth={2} />
                </div>
                <h3 className="font-bold text-[#0a0f1d] mb-1.5">{feature.title}</h3>
                <p className="text-xs text-[#0a0f1d]/60 leading-relaxed px-2">
                  {feature.desc}
                </p>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

import { useState, useEffect, useRef } from 'react';
import { Dices, RefreshCw, Users, CalendarDays, ArrowLeft, Settings2, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toPng } from 'html-to-image';

// FUNGSI LOKAL: Algoritma Computus & Penjadwalan Liturgi Pintar
function getMassEventsInMonth(year, month) {
  const f = Math.floor;
  const G = year % 19;
  const C = f(year / 100);
  const H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30;
  const I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11));
  const J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7;
  const L = I - J;
  const m = 3 + f((L + 40) / 44);
  const d = L + 28 - 31 * f(m / 4);
  const easter = new Date(year, m - 1, d);

  const addDays = (date, days) => {
    const r = new Date(date);
    r.setDate(r.getDate() + days);
    return r;
  };

  const christmas = new Date(year, 11, 25);
  let dayOfChristmas = christmas.getDay() === 0 ? 7 : christmas.getDay();
  const adventStart = addDays(christmas, -dayOfChristmas - 21);

  // Daftar Hari Raya Spesifik (Bisa jatuh di hari biasa atau menimpa hari Minggu)
  const specialDays = [
    { date: addDays(easter, -46), name: "Rabu Abu", color: "purple", isWeekday: true },
    { date: addDays(easter, -7), name: "Minggu Palma", color: "red", isWeekday: false },
    { date: addDays(easter, -3), name: "Kamis Putih", color: "white", isWeekday: true },
    { date: addDays(easter, -2), name: "Jumat Agung", color: "red", isWeekday: true },
    { date: addDays(easter, 0), name: "Hari Raya Paskah", color: "white", isWeekday: false },
    { date: addDays(easter, 39), name: "Hari Raya Kenaikan Tuhan", color: "white", isWeekday: true },
    { date: addDays(easter, 49), name: "Hari Raya Pentakosta", color: "red", isWeekday: false },
    { date: addDays(easter, 56), name: "Tritunggal Mahakudus", color: "white", isWeekday: false },
    { date: addDays(easter, 63), name: "Tubuh dan Darah Kristus", color: "white", isWeekday: false },
    { date: new Date(year, 0, 1), name: "Maria Bunda Allah", color: "white", isWeekday: true },
    { date: new Date(year, 11, 25), name: "Hari Raya Natal", color: "white", isWeekday: true },
    { date: addDays(adventStart, -7), name: "Kristus Raja Semesta Alam", color: "white", isWeekday: false },
  ];

  let events = [];

  // 1. Dapatkan semua hari Minggu dalam bulan tersebut
  let iter = new Date(year, month, 1);
  while (iter.getMonth() === month) {
    if (iter.getDay() === 0) {
      events.push({ date: new Date(iter), isWeekday: false });
    }
    iter.setDate(iter.getDate() + 1);
  }

  // 2. Gabungkan Hari Raya Spesifik ke dalam daftar jadwal
  specialDays.forEach(sd => {
    if (sd.date.getMonth() === month && sd.date.getFullYear() === year) {
      if (sd.isWeekday) {
         events.push({ date: sd.date, isWeekday: true, overrideLiturgy: sd });
      } else {
         const existing = events.find(e => e.date.getDate() === sd.date.getDate());
         if (existing) existing.overrideLiturgy = sd;
      }
    }
  });

  // 3. Urutkan berdasarkan tanggal
  events.sort((a, b) => a.date.getTime() - b.date.getTime());

  // 4. Proses masa liturgi untuk hari Minggu biasa
  return events.map(evt => {
    if (evt.overrideLiturgy) {
      return { date: evt.date, isWeekday: evt.isWeekday, liturgy: evt.overrideLiturgy };
    }

    const t = evt.date.getTime();
    let liturgy = { name: "Minggu Biasa", color: "green" };
    
    if (t > addDays(easter, -46).getTime() && t < easter.getTime()) liturgy = { name: "Minggu Prapaskah", color: "purple" };
    else if (t > easter.getTime() && t < addDays(easter, 49).getTime()) liturgy = { name: "Minggu Paskah", color: "white" };
    else if (t >= adventStart.getTime() && t < christmas.getTime()) liturgy = { name: "Minggu Adven", color: "purple" };
    else if (t >= christmas.getTime() || (evt.date.getMonth() === 0 && evt.date.getDate() <= 9)) liturgy = { name: "Masa Natal", color: "white" };

    return { date: evt.date, isWeekday: false, liturgy };
  });
}

export default function AcakPetugasPage() {
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const [namesText, setNamesText] = useState("");
  
  const [monthlySchedule, setMonthlySchedule] = useState(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const exportRef = useRef(null);

  const monthName = currentMonthDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
  const events = getMassEventsInMonth(currentMonthDate.getFullYear(), currentMonthDate.getMonth());

  // Jadwal Misa Tetap (Sabtu Sore, Minggu Pagi, Minggu Sore)
  const fixedMasses = [
    { id: 'sabtu-sore', label: 'Sabtu Sore' },
    { id: 'minggu-pagi', label: 'Minggu Pagi' },
    { id: 'minggu-sore', label: 'Minggu Sore' },
  ];

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1));
    setMonthlySchedule(null);
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1));
    setMonthlySchedule(null);
  };

  const formatTanggal = (date) => date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

  const handleShuffle = () => {
    if (!namesText.trim()) return;
    setIsShuffling(true);
    
    setTimeout(() => {
      const nameList = namesText.split('\n').map(n => n.trim()).filter(n => n !== '');
      
      // Fungsi untuk mengacak array (Fisher-Yates)
      const shuffleArray = (arr) => {
        const result = [...arr];
        for (let i = result.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
      };

      // Pool berisi nama-nama yang belum mendapat giliran
      let pool = shuffleArray(nameList);
      
      const getNextOfficer = () => {
        if (nameList.length === 0) return "- Kosong -";
        if (pool.length === 0) {
          // Jika pool habis, isi ulang dan acak lagi agar kombinasinya baru!
          pool = shuffleArray(nameList);
        }
        return pool.pop();
      };

      const generated = [];

      events.forEach((evt, eventIdx) => {
        const dateObj = evt.date;
        const liturgy = evt.liturgy;
        const isSpecialWeekday = evt.isWeekday;

        // Deteksi Hari Raya Besar (Natal & Paskah) untuk merubah qty otomatis ke 7
        const isMajorFeast = liturgy.name === "Hari Raya Paskah" || liturgy.name === "Hari Raya Natal";

        const eventSchedule = {
          id: eventIdx + 1,
          liturgyName: liturgy.name,
          liturgyColor: liturgy.color,
          masses: []
        };

        if (isSpecialWeekday) {
          // Buat 1 slot Misa untuk Hari Raya
          const qty = isMajorFeast ? 7 : 2;
          
          const massEntry = {
            id: `special-${eventIdx}`,
            name: `Misa Hari Raya (${formatTanggal(dateObj)})`,
            officers: []
          };
          for (let i = 0; i < qty; i++) {
            massEntry.officers.push(getNextOfficer());
          }

          // Tambahkan flag agar UI tahu ini mass khusus yang bisa melebar
          massEntry.isFullWidth = true;
          eventSchedule.masses.push(massEntry);
        } else {
          // Jika ini hari Minggu normal (termasuk Sabtu Sore)
          const saturday = new Date(dateObj);
          saturday.setDate(dateObj.getDate() - 1);

          fixedMasses.forEach(massConfig => {
            const isSaturday = massConfig.id.includes('sabtu');
            const massDate = isSaturday ? saturday : dateObj;
            
            const massEntry = {
              id: massConfig.id,
              name: `${massConfig.label} (${formatTanggal(massDate)})`,
              officers: []
            };

            // Gunakan 7 jika Hari Raya Besar, atau default 2 untuk Misa Biasa
            const qty = isMajorFeast ? 7 : 2;

            for (let i = 0; i < qty; i++) {
              massEntry.officers.push(getNextOfficer());
            }
            eventSchedule.masses.push(massEntry);
          });
        }

        generated.push(eventSchedule);
      });

      setMonthlySchedule(generated);
      setIsShuffling(false);
    }, 600);
  };

  const handleDownload = async () => {
    if (!exportRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(exportRef.current, { backgroundColor: '#ffffff', pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `Jadwal-Misa-${monthName.replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Gagal mendownload gambar", err);
    }
    setIsDownloading(false);
  };

  const colorMap = {
    green: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    red: 'bg-rose-50 border-rose-200 text-rose-800',
    white: 'bg-slate-100 border-slate-300 text-slate-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800',
    rose: 'bg-pink-50 border-pink-200 text-pink-800',
  };

  return (
    <div className="h-full bg-slate-50 text-slate-900 overflow-hidden flex flex-col rounded-3xl shadow-lg border border-slate-200">
      {/* Header Terang */}
      <div className="px-6 py-4 flex items-center justify-between bg-white border-b border-slate-200 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">Acak Petugas Misa</h1>
            <p className="text-xs text-slate-500 font-medium">Sistem Penjadwalan Cerdas</p>
          </div>
        </div>
        <div className="hidden md:flex p-2 bg-blue-50 text-blue-800 rounded-xl items-center gap-2 font-bold text-sm border border-blue-100">
          <CalendarDays className="w-4 h-4" /> Kalender Liturgi Abadi
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 h-full">
          
          {/* Kolom Kiri: Input */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            
            {/* Navigasi Bulan */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between shrink-0">
              <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-100 rounded-xl text-slate-600">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bulan Jadwal</p>
                <h2 className="text-base font-black text-slate-800">{monthName}</h2>
              </div>
              <button onClick={handleNextMonth} className="p-2 hover:bg-slate-100 rounded-xl text-slate-600">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm shrink-0">
              <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" /> Daftar Nama Petugas
              </h3>
              <textarea 
                className="w-full h-64 bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none text-sm placeholder:text-slate-400 font-medium"
                placeholder="Budi&#10;Sinta&#10;Andi&#10;Maria"
                value={namesText}
                onChange={(e) => setNamesText(e.target.value)}
              ></textarea>
            </div>

            <button 
              onClick={handleShuffle}
              disabled={isShuffling || !namesText.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black p-4 rounded-2xl text-sm flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50 shadow-md shrink-0"
            >
              <Dices className={`w-5 h-5 ${isShuffling ? 'animate-spin' : ''}`} />
              {isShuffling ? 'MENGACAK...' : 'BUAT JADWAL 1 BULAN'}
            </button>
          </div>

          {/* Kolom Kanan: Hasil & Preview Cetak */}
          <div className="lg:col-span-8 flex flex-col min-h-0">
            {monthlySchedule ? (
              <div className="bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
                  <h3 className="font-black text-slate-800">Preview Jadwal: {monthName}</h3>
                  <div className="flex gap-2">
                    <button onClick={handleShuffle} className="p-2 hover:bg-slate-200 rounded-xl text-slate-600 tooltip" title="Acak Ulang">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button onClick={handleDownload} disabled={isDownloading} className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center gap-2">
                      <Download className="w-4 h-4" /> {isDownloading ? 'Menyimpan...' : 'Cetak PNG'}
                    </button>
                  </div>
                </div>

                {/* Kontainer Scrollable untuk Canvas Cetak */}
                <div className="flex-1 overflow-auto p-4 md:p-8 bg-slate-200/50">
                  
                  {/* Element ini yang akan dicetak jadi PNG */}
                  <div id="schedule-export" ref={exportRef} className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 w-full max-w-4xl mx-auto">
                    
                    <div className="text-center mb-8 border-b-2 border-slate-100 pb-6">
                      <h1 className="text-2xl font-black text-slate-900 mb-1">JADWAL PETUGAS MISA</h1>
                      <h2 className="text-lg font-bold text-blue-600 uppercase tracking-widest">{monthName}</h2>
                    </div>

                    <div className="space-y-8">
                      {monthlySchedule.map((week) => (
                        <div key={week.id} className="break-inside-avoid">
                          <div className={`mb-3 px-4 py-2 rounded-lg flex justify-between items-center ${colorMap[week.liturgyColor] || colorMap.green}`}>
                            <h3 className="font-black">Pekan {week.id}</h3>
                            <span className="text-xs font-bold uppercase tracking-wider bg-white/50 px-2 py-1 rounded">{week.liturgyName}</span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-2">
                            {week.masses.map(mass => (
                              <div key={mass.id} className={`border-l-2 border-slate-200 pl-4 ${mass.isFullWidth ? 'md:col-span-3' : ''}`}>
                                <h4 className="text-xs font-bold text-slate-500 mb-2">{mass.name}</h4>
                                <ul className={mass.officers.length > 3 ? "grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1" : "space-y-1"}>
                                  {mass.officers.map((name, idx) => (
                                    <li key={idx} className="text-sm font-medium text-slate-800 flex items-start gap-2 break-inside-avoid">
                                      <span className="text-slate-400 text-xs mt-[2px] w-3 shrink-0">{idx + 1}.</span> {name}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-12 pt-6 border-t border-slate-100 text-center text-xs font-medium text-slate-400">
                      Generated by Vesper AIO &bull; Jadwal dapat berubah sewaktu-waktu.
                    </div>
                  </div>

                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <CalendarDays className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Jadwal Bulanan Belum Dibuat</h3>
                <p className="text-slate-500 text-sm max-w-[280px]">Pilih bulan, isi nama petugas, lalu klik tombol untuk meng-*generate* jadwal otomatis selama satu bulan penuh.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Maximize, RefreshCcw, Hand, ArrowLeft } from 'lucide-react';

export default function CameraView() {
  const videoRef = useRef(null);
  const [error, setError] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const [toastInfo, setToastInfo] = useState('');
  const [zoom, setZoom] = useState(1);
  const navigate = useNavigate();

  // State untuk multiple kamera
  const camerasRef = useRef([]);
  const [activeCamIdx, setActiveCamIdx] = useState(0);
  const [isFront, setIsFront] = useState(false);

  // Referensi untuk gesture
  const initialDistance = useRef(null);
  const pressTimer = useRef(null);
  const lastTapTime = useRef(0);

  const showToast = (msg) => {
    setToastInfo(msg);
    setTimeout(() => setToastInfo(''), 2000);
  };

  useEffect(() => {
    if (!hasStarted) return;

    let currentStream = null;

    async function loadCamera() {
      try {
        // Ambil daftar semua kamera (lensa ultrawide, macro, depan, dll)
        if (camerasRef.current.length === 0) {
          // Pancing izin akses dulu
          const tempStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          const devices = await navigator.mediaDevices.enumerateDevices();
          camerasRef.current = devices.filter(d => d.kind === 'videoinput');
          tempStream.getTracks().forEach(t => t.stop());
        }

        if (camerasRef.current.length > 0) {
          const safeIdx = activeCamIdx % camerasRef.current.length;
          const deviceId = camerasRef.current[safeIdx].deviceId;
          
          currentStream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: deviceId } }
          });
          
          if (videoRef.current) {
            videoRef.current.srcObject = currentStream;
          }

          // Cek apakah ini kamera depan (agar bisa di-mirror)
          const label = camerasRef.current[safeIdx].label.toLowerCase();
          setIsFront(label.includes('front') || label.includes('user') || label.includes('depan'));
        }
      } catch (err) {
        setError('Akses kamera ditolak atau perangkat tidak mendukung.');
      }
    }
    loadCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [hasStarted, activeCamIdx]);

  // --- LOGIKA GESTURE ---

  const handleScreenTap = () => {
    try {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.log("Gagal layar penuh", err);
    }
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      pressTimer.current = setTimeout(() => {
        if (document.fullscreenElement) document.exitFullscreen();
        navigate('/');
      }, 1000); // 1 detik tahan untuk keluar
    }
    
    if (e.touches.length === 2) {
      clearTimeout(pressTimer.current);
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      initialDistance.current = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && initialDistance.current !== null) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
      const delta = dist - initialDistance.current;
      
      let newZoom = zoom + (delta * 0.01);
      newZoom = Math.min(Math.max(1, newZoom), 5);
      
      setZoom(newZoom);
      initialDistance.current = dist;
    }
  };

  const handleTouchEnd = (e) => {
    clearTimeout(pressTimer.current);
    
    // Deteksi Double Tap: Ganti lensa/kamera
    if (e.changedTouches.length === 1) {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTapTime.current;
      
      if (tapLength < 300 && tapLength > 0 && camerasRef.current.length > 1) {
        const newIdx = (activeCamIdx + 1) % camerasRef.current.length;
        setActiveCamIdx(newIdx);
        setZoom(1); // Reset zoom
        
        let camName = camerasRef.current[newIdx].label || `Lensa ${newIdx + 1}`;
        camName = camName.replace(/\([^)]*\)/g, '').trim() || 'Ganti Lensa';
        showToast(camName);
      }
      lastTapTime.current = currentTime;
    }

    if (e.touches.length < 2) {
      initialDistance.current = null;
    }
  };

  // --- LAYAR PANDUAN AWAL ---
  if (!hasStarted) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0a0f1d] flex flex-col items-center justify-center p-8 text-white animate-in fade-in">
        <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6">
          <Hand className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-black mb-6 tracking-wide text-center">Panduan Gesture</h2>
        
        <div className="space-y-4 mb-12 w-full max-w-sm">
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
            <Maximize className="w-6 h-6 text-blue-400 shrink-0" />
            <div>
              <p className="font-bold text-sm">Ketuk 1x (Tap)</p>
              <p className="text-xs text-white/60">Mode Layar Penuh (Sembunyikan Baterai)</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
            <RefreshCcw className="w-6 h-6 text-green-400 shrink-0" />
            <div>
              <p className="font-bold text-sm">Ketuk 2x Cepat</p>
              <p className="text-xs text-white/60">Ganti Lensa (Depan / Belakang / 0.5x)</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="flex shrink-0"><Hand className="w-5 h-5 text-yellow-400"/><Hand className="w-5 h-5 -ml-2 text-yellow-400"/></div>
            <div>
              <p className="font-bold text-sm">Cubit 2 Jari (Pinch)</p>
              <p className="text-xs text-white/60">Zoom In & Zoom Out</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
            <ArrowLeft className="w-6 h-6 text-red-400 shrink-0" />
            <div>
              <p className="font-bold text-sm">Tekan & Tahan (1 Detik)</p>
              <p className="text-xs text-white/60">Keluar ke Menu Utama</p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setHasStarted(true)}
          className="w-full max-w-sm bg-white text-[#0a0f1d] font-black py-4 rounded-xl text-lg hover:scale-105 active:scale-95 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]"
        >
          BUKA KAMERA SEKARANG
        </button>
      </div>
    );
  }

  // --- LAYAR KAMERA MURNI ---
  return (
    <div 
      className="fixed inset-0 z-50 bg-black flex flex-col overflow-hidden"
      onClick={handleScreenTap}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
    >
      <div 
        className={`absolute top-12 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 pointer-events-none
          ${toastInfo ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
      >
        <span className="bg-black/50 text-white text-sm font-bold px-6 py-2 rounded-full backdrop-blur-md border border-white/20 shadow-lg">
          {toastInfo}
        </span>
      </div>

      {error ? (
        <div className="flex-1 flex items-center justify-center text-red-500 font-bold p-8 text-center bg-black">
          {error}
        </div>
      ) : (
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover pointer-events-none transition-transform duration-75 origin-center"
          style={{ transform: `scaleX(${isFront ? -1 : 1}) scale(${zoom})` }}
        />
      )}
    </div>
  );
}

import { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { dapatkanJadwalMisaBulanIni } from '../utils/liturgyCalendar';

export function useMassRandomizer() {
  const [tanggalBulanIni, setTanggalBulanIni] = useState(new Date());
  const [teksNamaPetugas, setTeksNamaPetugas] = useState("");
  
  const [jadwalBulanan, setJadwalBulanan] = useState(null);
  const [sedangMengacak, setSedangMengacak] = useState(false);
  const [sedangMengunduh, setSedangMengunduh] = useState(false);

  const referensiEkspor = useRef(null);

  const namaBulan = tanggalBulanIni.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
  const jadwalLengkap = dapatkanJadwalMisaBulanIni(tanggalBulanIni.getFullYear(), tanggalBulanIni.getMonth());

  const sesiMisaTetap = [
    { id: 'sabtu-sore', label: 'Sabtu Sore' },
    { id: 'minggu-pagi', label: 'Minggu Pagi' },
    { id: 'minggu-sore', label: 'Minggu Sore' },
  ];

  const keBulanSebelumnya = () => {
    setTanggalBulanIni(new Date(tanggalBulanIni.getFullYear(), tanggalBulanIni.getMonth() - 1, 1));
    setJadwalBulanan(null);
  };

  const keBulanBerikutnya = () => {
    setTanggalBulanIni(new Date(tanggalBulanIni.getFullYear(), tanggalBulanIni.getMonth() + 1, 1));
    setJadwalBulanan(null);
  };

  const formatTanggal = (tanggal) => tanggal.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

  const buatJadwalAcak = () => {
    if (!teksNamaPetugas.trim()) return;
    setSedangMengacak(true);
    
    setTimeout(() => {
      const daftarNama = teksNamaPetugas.split('\n').map(n => n.trim()).filter(n => n !== '');
      
      const acakArray = (arr) => {
        const hasil = [...arr];
        for (let i = hasil.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [hasil[i], hasil[j]] = [hasil[j], hasil[i]];
        }
        return hasil;
      };

      let wadahNama = acakArray(daftarNama);
      
      const ambilPetugasBerikutnya = () => {
        if (daftarNama.length === 0) return "- Kosong -";
        if (wadahNama.length === 0) {
          wadahNama = acakArray(daftarNama);
        }
        return wadahNama.pop();
      };

      const hasilJadwal = [];

      jadwalLengkap.forEach((acara, indeksAcara) => {
        const objekTanggal = acara.tanggal;
        const liturgi = acara.liturgi;
        const adalahHariBiasaSpesial = acara.adalahHariBiasa;

        const adalahHariRayaBesar = liturgi.nama === "Hari Raya Paskah" || liturgi.nama === "Hari Raya Natal";

        const jadwalAcara = {
          id: indeksAcara + 1,
          namaLiturgi: liturgi.nama,
          warnaLiturgi: liturgi.warna,
          sesi: []
        };

        if (adalahHariBiasaSpesial) {
          const kuota = adalahHariRayaBesar ? 7 : 2;
          
          const sesiKhusus = {
            id: `khusus-${indeksAcara}`,
            nama: `Misa Hari Raya (${formatTanggal(objekTanggal)})`,
            petugas: []
          };
          for (let i = 0; i < kuota; i++) {
            sesiKhusus.petugas.push(ambilPetugasBerikutnya());
          }

          sesiKhusus.layarPenuh = true;
          jadwalAcara.sesi.push(sesiKhusus);
        } else {
          const hariSabtu = new Date(objekTanggal);
          hariSabtu.setDate(objekTanggal.getDate() - 1);

          sesiMisaTetap.forEach(konfigurasiSesi => {
            const apakahSabtu = konfigurasiSesi.id.includes('sabtu');
            const tanggalSesi = apakahSabtu ? hariSabtu : objekTanggal;
            
            const entriSesi = {
              id: konfigurasiSesi.id,
              nama: `${konfigurasiSesi.label} (${formatTanggal(tanggalSesi)})`,
              petugas: []
            };

            const kuota = adalahHariRayaBesar ? 7 : 2;

            for (let i = 0; i < kuota; i++) {
              entriSesi.petugas.push(ambilPetugasBerikutnya());
            }
            jadwalAcara.sesi.push(entriSesi);
          });
        }

        hasilJadwal.push(jadwalAcara);
      });

      setJadwalBulanan(hasilJadwal);
      setSedangMengacak(false);
    }, 600);
  };

  const unduhGambar = async () => {
    if (!referensiEkspor.current) return;
    setSedangMengunduh(true);
    try {
      const urlData = await toPng(referensiEkspor.current, { backgroundColor: '#ffffff', pixelRatio: 2 });
      const tautan = document.createElement('a');
      tautan.download = `Jadwal-Misa-${namaBulan.replace(/\s+/g, '-')}.png`;
      tautan.href = urlData;
      tautan.click();
    } catch (kesalahan) {
      console.error("Gagal mendownload gambar", kesalahan);
    }
    setSedangMengunduh(false);
  };

  return {
    teksNamaPetugas,
    setTeksNamaPetugas,
    namaBulan,
    keBulanSebelumnya,
    keBulanBerikutnya,
    buatJadwalAcak,
    sedangMengacak,
    jadwalBulanan,
    referensiEkspor,
    unduhGambar,
    sedangMengunduh
  };
}

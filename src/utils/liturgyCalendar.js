export function dapatkanJadwalMisaBulanIni(tahun, bulan) {
  const f = Math.floor;
  const G = tahun % 19;
  const C = f(tahun / 100);
  const H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30;
  const I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11));
  const J = (tahun + f(tahun / 4) + I + 2 - C + f(C / 4)) % 7;
  const L = I - J;
  const m = 3 + f((L + 40) / 44);
  const d = L + 28 - 31 * f(m / 4);
  const paskah = new Date(tahun, m - 1, d);

  const tambahHari = (tanggal, hari) => {
    const r = new Date(tanggal);
    r.setDate(r.getDate() + hari);
    return r;
  };

  const natal = new Date(tahun, 11, 25);
  let hariDalamMingguNatal = natal.getDay() === 0 ? 7 : natal.getDay();
  const awalAdven = tambahHari(natal, -hariDalamMingguNatal - 21);

  // Daftar Hari Raya Spesifik (Bisa jatuh di hari biasa atau menimpa hari Minggu)
  const hariSpesial = [
    { tanggal: tambahHari(paskah, -46), nama: "Rabu Abu", warna: "purple", adalahHariBiasa: true },
    { tanggal: tambahHari(paskah, -7), nama: "Minggu Palma", warna: "red", adalahHariBiasa: false },
    { tanggal: tambahHari(paskah, -3), nama: "Kamis Putih", warna: "white", adalahHariBiasa: true },
    { tanggal: tambahHari(paskah, -2), nama: "Jumat Agung", warna: "red", adalahHariBiasa: true },
    { tanggal: tambahHari(paskah, 0), nama: "Hari Raya Paskah", warna: "white", adalahHariBiasa: false },
    { tanggal: tambahHari(paskah, 39), nama: "Hari Raya Kenaikan Tuhan", warna: "white", adalahHariBiasa: true },
    { tanggal: tambahHari(paskah, 49), nama: "Hari Raya Pentakosta", warna: "red", adalahHariBiasa: false },
    { tanggal: tambahHari(paskah, 56), nama: "Tritunggal Mahakudus", warna: "white", adalahHariBiasa: false },
    { tanggal: tambahHari(paskah, 63), nama: "Tubuh dan Darah Kristus", warna: "white", adalahHariBiasa: false },
    { tanggal: new Date(tahun, 0, 1), nama: "Maria Bunda Allah", warna: "white", adalahHariBiasa: true },
    { tanggal: new Date(tahun, 11, 25), nama: "Hari Raya Natal", warna: "white", adalahHariBiasa: true },
    { tanggal: tambahHari(awalAdven, -7), nama: "Kristus Raja Semesta Alam", warna: "white", adalahHariBiasa: false },
  ];

  let daftarJadwal = [];

  // 1. Dapatkan semua hari Minggu dalam bulan tersebut
  let iterasiTanggal = new Date(tahun, bulan, 1);
  while (iterasiTanggal.getMonth() === bulan) {
    if (iterasiTanggal.getDay() === 0) {
      daftarJadwal.push({ tanggal: new Date(iterasiTanggal), adalahHariBiasa: false });
    }
    iterasiTanggal.setDate(iterasiTanggal.getDate() + 1);
  }

  // 2. Gabungkan Hari Raya Spesifik ke dalam daftar jadwal
  hariSpesial.forEach(hs => {
    if (hs.tanggal.getMonth() === bulan && hs.tanggal.getFullYear() === tahun) {
      if (hs.adalahHariBiasa) {
         daftarJadwal.push({ tanggal: hs.tanggal, adalahHariBiasa: true, liturgiKhusus: hs });
      } else {
         const ada = daftarJadwal.find(e => e.tanggal.getDate() === hs.tanggal.getDate());
         if (ada) ada.liturgiKhusus = hs;
      }
    }
  });

  // 3. Urutkan berdasarkan tanggal
  daftarJadwal.sort((a, b) => a.tanggal.getTime() - b.tanggal.getTime());

  // 4. Proses masa liturgi untuk hari Minggu biasa
  return daftarJadwal.map(jadwal => {
    if (jadwal.liturgiKhusus) {
      return { tanggal: jadwal.tanggal, adalahHariBiasa: jadwal.adalahHariBiasa, liturgi: jadwal.liturgiKhusus };
    }

    const t = jadwal.tanggal.getTime();
    let liturgi = { nama: "Minggu Biasa", warna: "green" };
    
    if (t > tambahHari(paskah, -46).getTime() && t < paskah.getTime()) liturgi = { nama: "Minggu Prapaskah", warna: "purple" };
    else if (t > paskah.getTime() && t < tambahHari(paskah, 49).getTime()) liturgi = { nama: "Minggu Paskah", warna: "white" };
    else if (t >= awalAdven.getTime() && t < natal.getTime()) liturgi = { nama: "Minggu Adven", warna: "purple" };
    else if (t >= natal.getTime() || (jadwal.tanggal.getMonth() === 0 && jadwal.tanggal.getDate() <= 9)) liturgi = { nama: "Masa Natal", warna: "white" };

    return { tanggal: jadwal.tanggal, adalahHariBiasa: false, liturgi };
  });
}

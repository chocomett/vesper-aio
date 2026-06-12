import { 
  LayoutDashboard, 
  UserCheck, 
  Package, 
  ClipboardList, 
  Receipt, 
  Wallet, 
  Camera, 
  FileText, 
  Wifi,
  Dices
} from 'lucide-react'

export const STATIC_USERS = {
  'admin': { username: 'admin', password: '123', role: 'admin', name: 'Tim Vesper (Admin)' },
  'komsos': { username: 'komsos', password: '123', role: 'komsos', name: 'Tim Komsos' },
  'maint': { username: 'maint', password: '123', role: 'maintenance', name: 'Tim Maintenance' },
}

export const ALL_FEATURES = [
  { id: 'dashboard', title: "Dashboard", path: "/dashboard", icon: LayoutDashboard, desc: "Ringkasan dan Analitik", roles: ['admin'] },
  { id: 'absen', title: "Easy Absen", path: "/absen", icon: UserCheck, desc: "Absensi kehadiran anggota", roles: ['admin', 'komsos', 'maintenance'] },
  { id: 'inventaris', title: "Inventaris", path: "/inventaris", icon: Package, desc: "Manajemen stok barang", roles: ['admin', 'maintenance'] },
  { id: 'peminjaman', title: "Peminjaman", path: "/peminjaman", icon: ClipboardList, desc: "Log pinjam & kembali", roles: ['admin', 'komsos', 'maintenance'] },
  { id: 'acak-petugas', title: "Acak Petugas", path: "/acak-petugas", icon: Dices, desc: "Generator jadwal tugas", roles: ['admin'] },
  { id: 'penjualan', title: "Penjualan", path: "/penjualan", icon: Receipt, desc: "Kasir teks misa harian", roles: ['admin', 'komsos', 'maintenance'] },
  { id: 'keuangan', title: "Keuangan", path: "/keuangan", icon: Wallet, desc: "Pencatatan pengeluaran tim", roles: ['admin'] },
  { id: 'fullcam', title: "Fullcam", path: "/fullcam", icon: Camera, desc: "Kamera web gesture UI", roles: ['admin', 'komsos', 'maintenance'] },
  { id: 'template-misa', title: "Template Misa", path: "/template-misa", icon: FileText, desc: "Generator layout teks", roles: ['admin', 'komsos', 'maintenance'] },
  { id: 'wifi', title: "Voucher WiFi", path: "/wifi", icon: Wifi, desc: "Cetak akses mikrotik", roles: ['admin', 'maintenance'] },
]

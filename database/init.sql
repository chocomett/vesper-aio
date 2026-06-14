-- ==========================================
-- MODUL USER (SSO VESPER)
-- ==========================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'komsos', 'umat') DEFAULT 'umat',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, password, role) VALUES 
('matthew', 'matthew123', 'admin'),
('hendrik', 'hendrik456', 'komsos'),
('tamu_wifi', 'wifi_gratis', 'umat');

-- ==========================================
-- MODUL INVENTARIS (BARANG KOMSOS)
-- ==========================================
CREATE TABLE IF NOT EXISTS inventaris (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode_barang VARCHAR(30) NOT NULL UNIQUE,
    nama_barang VARCHAR(100) NOT NULL,
    kategori VARCHAR(50) NOT NULL,
    kondisi ENUM('Baik', 'Rusak Ringan', 'Rusak Berat', 'Hilang') DEFAULT 'Baik',
    jumlah_total INT DEFAULT 1,
    jumlah_dipinjam INT DEFAULT 0, -- Kolom sakti untuk melacak berapa unit yang sedang dipinjam
    lokasi_simpan VARCHAR(100),
    catatan TEXT,
    terakhir_diupdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ==========================================
-- MODUL PEMINJAMAN (TRACKING BARANG)
-- ==========================================
CREATE TABLE IF NOT EXISTS peminjaman (
    id INT AUTO_INCREMENT PRIMARY KEY,
    inventaris_id INT NOT NULL,
    peminjam_nama VARCHAR(100) NOT NULL, -- Nama orang yang meminjam
    user_id INT NULL, -- (Opsional) Jika peminjam adalah anggota komsos yang punya akun Vesper
    jumlah_pinjam INT DEFAULT 1,
    status ENUM('Dipinjam', 'Dikembalikan') DEFAULT 'Dipinjam',
    keperluan TEXT,
    tanggal_pinjam TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rencana_kembali DATETIME NOT NULL,
    tanggal_dikembalikan DATETIME NULL,
    FOREIGN KEY (inventaris_id) REFERENCES inventaris(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ==========================================
-- TRIGGER OTOMATIS (ROBOT DATABASE)
-- ==========================================
DELIMITER //

-- Robot 1: Saat ada peminjaman baru, otomatis tambah "jumlah_dipinjam" di inventaris
CREATE TRIGGER after_peminjaman_insert 
AFTER INSERT ON peminjaman
FOR EACH ROW 
BEGIN
    IF NEW.status = 'Dipinjam' THEN
        UPDATE inventaris 
        SET jumlah_dipinjam = jumlah_dipinjam + NEW.jumlah_pinjam 
        WHERE id = NEW.inventaris_id;
    END IF;
END //

-- Robot 2: Saat barang dikembalikan, otomatis kurangi "jumlah_dipinjam" di inventaris
CREATE TRIGGER after_peminjaman_update 
AFTER UPDATE ON peminjaman
FOR EACH ROW 
BEGIN
    IF OLD.status = 'Dipinjam' AND NEW.status = 'Dikembalikan' THEN
        UPDATE inventaris 
        SET jumlah_dipinjam = jumlah_dipinjam - NEW.jumlah_pinjam 
        WHERE id = NEW.inventaris_id;
    END IF;
END //

DELIMITER ;

-- Masukkan Dummy Data Peminjaman (Seolah-olah Hendrik sedang pinjam kamera)
INSERT INTO peminjaman (inventaris_id, peminjam_nama, user_id, jumlah_pinjam, status, keperluan, rencana_kembali) 
VALUES (1, 'Hendrik', 2, 1, 'Dipinjam', 'Misa Perkawinan', DATE_ADD(NOW(), INTERVAL 2 DAY));

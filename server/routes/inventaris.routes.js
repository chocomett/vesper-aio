import express from 'express';
import dbPool from '../config/db.js';

const router = express.Router();

// GET: Mengambil semua barang
router.get('/', async (req, res) => {
  try {
    const [rows] = await dbPool.query('SELECT * FROM inventaris ORDER BY kategori ASC, nama_barang ASC');
    res.json(rows);
  } catch (error) {
    console.error("Error fetching inventaris:", error);
    res.status(500).json({ error: error.message || "Gagal mengambil data inventaris dari database" });
  }
});

// POST: Menambah barang baru
router.post('/', async (req, res) => {
  let { kode_barang, nama_barang, kategori, kondisi, jumlah_total, lokasi_simpan, catatan } = req.body;
  
  try {
    // AUTO GENERATE KODE BARANG
    if (!kode_barang || kode_barang.trim() === '') {
      const prefixMap = {
        'Kamera': 'CAM', 'Lensa': 'LNS', 'Audio': 'AUD', 
        'Kabel': 'CBL', 'Lighting': 'LGT', 'Komputer': 'PC', 
        'Aksesoris': 'ACC', 'Lainnya': 'ETC'
      };
      const prefix = prefixMap[kategori] || 'ITM';
      
      const [[{ maxId }]] = await dbPool.query('SELECT MAX(id) as maxId FROM inventaris');
      const nextId = (maxId || 0) + 1;
      kode_barang = `VSP-${prefix}-${String(nextId).padStart(3, '0')}`;
    }

    const query = `
      INSERT INTO inventaris (kode_barang, nama_barang, kategori, kondisi, jumlah_total, lokasi_simpan, catatan) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await dbPool.query(query, [
      kode_barang, nama_barang, kategori, kondisi || 'Baik', jumlah_total || 1, lokasi_simpan, catatan
    ]);
    res.status(201).json({ id: result.insertId, kode_barang, message: "Barang berhasil ditambahkan" });
  } catch (error) {
    console.error("Error adding inventaris:", error);
    res.status(500).json({ error: error.message || "Gagal menyimpan barang ke database" });
  }
});

// PUT: Update barang (Edit)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { kode_barang, nama_barang, kategori, kondisi, jumlah_total, lokasi_simpan, catatan } = req.body;
  try {
    const query = `
      UPDATE inventaris 
      SET kode_barang=?, nama_barang=?, kategori=?, kondisi=?, jumlah_total=?, lokasi_simpan=?, catatan=?
      WHERE id=?
    `;
    const [result] = await dbPool.query(query, [
      kode_barang, nama_barang, kategori, kondisi, jumlah_total, lokasi_simpan, catatan, id
    ]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Barang tidak ditemukan" });
    res.json({ message: "Barang berhasil diupdate" });
  } catch (error) {
    console.error("Error updating inventaris:", error);
    res.status(500).json({ error: error.message || "Gagal mengupdate barang" });
  }
});

// DELETE: Menghapus barang
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await dbPool.query('DELETE FROM inventaris WHERE id=?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Barang tidak ditemukan" });
    res.json({ message: "Barang berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting inventaris:", error);
    res.status(500).json({ error: error.message || "Gagal menghapus barang" });
  }
});

export default router;

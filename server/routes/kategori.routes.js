import express from 'express';
import dbPool from '../config/db.js';

const router = express.Router();

// GET semua kategori
router.get('/', async (req, res) => {
  try {
    const [rows] = await dbPool.query('SELECT * FROM kategori_barang ORDER BY id ASC');
    res.json(rows);
  } catch (error) {
    console.error("Error fetching kategori:", error);
    res.status(500).json({ error: "Gagal mengambil data kategori" });
  }
});

// POST tambah kategori baru
router.post('/', async (req, res) => {
  const { nama } = req.body;
  if (!nama || nama.trim() === '') {
    return res.status(400).json({ error: "Nama kategori tidak boleh kosong" });
  }

  try {
    const [result] = await dbPool.query('INSERT INTO kategori_barang (nama) VALUES (?)', [nama.trim()]);
    res.status(201).json({ id: result.insertId, nama: nama.trim() });
  } catch (error) {
    console.error("Error adding kategori:", error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: "Kategori sudah ada!" });
    }
    res.status(500).json({ error: "Gagal menambah kategori" });
  }
});

// DELETE kategori
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await dbPool.query('DELETE FROM kategori_barang WHERE id=?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Kategori tidak ditemukan" });
    res.json({ message: "Kategori berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting kategori:", error);
    res.status(500).json({ error: "Gagal menghapus kategori" });
  }
});

export default router;

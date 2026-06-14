import express from "express";
import ViteExpress from "vite-express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const app = express();
app.use(express.json());

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3307,
  user: process.env.DB_USER || "admin",
  password: process.env.DB_PASSWORD || "admin",
  database: process.env.DB_NAME || "vesper_rpd",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};
console.log("DB CONFIG:", dbConfig);
const dbPool = mysql.createPool(dbConfig);

// Endpoint API
app.get('/api/inventaris', async (req, res) => {
  try {
    const [rows] = await dbPool.query('SELECT * FROM inventaris ORDER BY kategori ASC, nama_barang ASC');
    res.json(rows);
  } catch (error) {
    fs.writeFileSync("db_error.log", String(error.stack || error));
    console.error("Error fetching inventaris:", error);
    res.status(500).json({ error: "Gagal mengambil data inventaris dari database" });
  }
});

app.post('/api/inventaris', async (req, res) => {
  const { kode_barang, nama_barang, kategori, kondisi, jumlah_total, lokasi_simpan, catatan } = req.body;
  try {
    const query = `
      INSERT INTO inventaris (kode_barang, nama_barang, kategori, kondisi, jumlah_total, lokasi_simpan, catatan) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await dbPool.query(query, [
      kode_barang, nama_barang, kategori, kondisi || 'Baik', jumlah_total || 1, lokasi_simpan, catatan
    ]);
    res.status(201).json({ id: result.insertId, message: "Barang berhasil ditambahkan" });
  } catch (error) {
    console.error("Error adding inventaris:", error);
    res.status(500).json({ error: "Gagal menyimpan barang ke database" });
  }
});

const PORT = process.env.PORT || 5173;

ViteExpress.listen(app, PORT, () => {
  console.log(`✅ Vesper AIO Server berjalan di http://localhost:${PORT}`);
});

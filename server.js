import express from "express";
import ViteExpress from "vite-express";
import dotenv from "dotenv";
import fs from "fs";

// Import Routes
import inventarisRoutes from "./server/routes/inventaris.routes.js";
import kategoriRoutes from "./server/routes/kategori.routes.js";

dotenv.config();

const app = express();
app.use(express.json());

// =====================================
// REGISTER ROUTES (Daftar API)
// =====================================
app.use('/api/inventaris', inventarisRoutes);
app.use('/api/kategori', kategoriRoutes);

// Nanti kalau ada peminjaman, tinggal tambah:
// app.use('/api/peminjaman', peminjamanRoutes);

const PORT = process.env.PORT || 5173;

ViteExpress.listen(app, PORT, () => {
  console.log(`✅ Vesper AIO Server berjalan di http://localhost:${PORT}`);
});

import mysql from 'mysql2/promise';
const dbPool = mysql.createPool({
  host: "localhost",
  port: 3307,
  user: "admin",
  password: "admin",
  database: "vesper_rpd",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
dbPool.query('SELECT * FROM inventaris ORDER BY kategori ASC, nama_barang ASC')
  .then(rows => console.log("Success:", rows[0].length))
  .catch(err => console.error("DB Error:", err));

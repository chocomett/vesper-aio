import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

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

export default dbPool;

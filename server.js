//import modul
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./db.js";
import bookRoutes from "./bookRoutes.js";

//Configurasi awal
dotenv.config(); //Membaca file env
const app = express(); //Membuat instance Express
app.use(cors()); //Mengizinkan akses API lintas domain
app.use(express.json()); //mem-parse teks JSON menjadi objek JavaScript supaya mudah diakses di dalam kode.

// Routing Utama (Semua route buku dimulai dengan /books)
app.use("/books", bookRoutes);

// Tes koneksi database
sequelize.authenticate()
  .then(() => console.log("Connected to MySQL"))
  .catch((err) => console.error("Database connection failed:", err));

// Jalankan server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

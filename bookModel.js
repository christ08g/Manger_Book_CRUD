//import modul dan koneksi
import { DataTypes } from "sequelize";
import sequelize from "./db.js";

//Menggunakan ORM Sequelize untuk mendefinisikan buku dan sesuaikan setiap tipe data dan nama kolom serta nama tabel pada tabel database pada database
const Book = sequelize.define("Book", {
  ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  Title: {
    type: DataTypes.STRING(144),
    allowNull: false,
  },
  Author: {
    type: DataTypes.STRING(144),
    allowNull: false,
  },
  Year: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'Year' 
  },
}, {
  tableName: "book_manager", 
  timestamps: false,
});

export default Book;


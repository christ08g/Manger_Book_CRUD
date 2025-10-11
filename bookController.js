import Book from "./bookModel.js";
import { Op } from "sequelize";

// Ambil semua buku
export const getAllBooks = async (req, res) => {
  try {
    const { ID, Title, Author, Year } = req.query;
    const where = {};
    if (ID) where.ID = ID;
    if (Title) where.Title = { [Op.like]: `%${Title}%` };
    if (Author) where.Author = { [Op.like]: `%${Author}%` };
    if (Year) where.Year = Year;

    const book = await Book.findAll({ where });
    res.json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Ambil detail buku berdasarkan ID
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.ID);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tambah buku baru
export const createBook = async (req, res) => {
  try {
    const { Title, Author, Year } = req.body;
    if (!Title || !Author || !Year) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    const cleanYear = Year.split("T")[0];

    const newBook = await Book.create({
      Title,
      Author,
      Year: cleanYear,
    });

    res.status(201).json({ success: true, data: newBook });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Data Buku
export const updateBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.ID);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const { Title, Author, Year } = req.body;
    await book.update({
      Title: Title ?? book.Title,
      Author: Author ?? book.Author,
      Year: Year ?? book.Year,
    });

    res.json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Hapus Buku
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.ID);
    if (!book) return res.status(404).json({ message: "Book not found" });
    await book.destroy();
    res.json({ success: true, message: "Book deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

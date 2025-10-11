import express from "express";
import {getAllBooks, getBookById, createBook, updateBook, deleteBook} from "./bookController.js";

const router = express.Router();

router.get("/", getAllBooks);
router.get("/:ID", getBookById);
router.post("/", createBook);
router.put("/:ID", updateBook);
router.delete("/:ID", deleteBook);

export default router;

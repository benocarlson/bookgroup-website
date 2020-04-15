const express = require('express');
const mongoose = require('mongoose');

const multer = require('multer')
const upload = multer({
  dest: '../front-end/public/images/books/',
  limits: {
    fileSize: 10000000
  }
});

const router = express.Router();

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  description: String,
  coverImagePath: String,
});

const Book = mongoose.model('Book', bookSchema);

router.post("/", upload.single('book'), async (req, res) => {
  if (!req.file)
    return res.status(400).send({
      message: "Must include a picture of the cover!"
    });
  
  if (!req.body.title)
    return res.status(400).send({
      message: "Book must have a title"
    });
  
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    coverImagePath: "/images/books/" + req.file.filename,
  });

  try {
    await book.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.get("/", async (req, res) => {
  try {
    let books = await Book.find();
    return res.send(books);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.get("/:id", async (req, res) => {
  try {
    let book = await Book.findOne({
      _id: req.params._id
    });
    if (!book)
      return res.status(404).send({
        message: "Book not found!"
      });
    return res.send(book);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

module.exports = {
  model: Book,
  routes: router
}
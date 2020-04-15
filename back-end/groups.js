const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const users = require("./users.js");
const User = users.model;
const validUser = users.valid;

const books = require("./books.js");
const Book = books.model;

const groupSchema = new mongoose.Schema({
  name: String,
  description: String,
  members: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  books: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Book'
  }],
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

const Group = mongoose.model('Group', groupSchema);

router.post("/", validUser, async (req, res) => {
  if (!req.body.name || !req.body.description)
    return res.status(400).send({
      message: "Group must have a name and description"
    });
  
  const group = new Group({
    name: req.body.name,
    description: req.body.description,
    owner: req.user,
    members: [req.user],
    books: [],
  });

  try {
    await group.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.put("/join/:groupId", validUser, async (req, res) => {
  try {
    let group = await Group.findOne({
      _id: req.params.groupId
    });
    if (!group) {
      return res.status(404).send({
        message: "Group not found!"
      });
    }
    if (!group.members.includes(req.user._id)) {
      group.members.push(req.user._id);
      await group.save();
    }
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.put("/leave/:groupId", validUser, async (req, res) => {
  try {
    let group = await Group.findOne({
      _id: req.params.groupId
    });
    if (!group) {
      return res.status(404).send({
        message: "Group not found!"
      });
    }
    if (group.members.includes(req.user._id)) {
      let index = group.members.indexOf(req.user._id);
      group.members.splice(index, 1);
      await group.save();
    }
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.put("/add/:groupId/:bookId", validUser, async (req, res) => {
  try {
    let group = await Group.findOne({
      _id: req.params.groupId
    });
    if (!group) return res.status(404).send({
      message: "Group not found!"
    });
    if (!group.members.includes(req.user._id)) {
      return res.status(403).send({
        message: "You must join a group before adding books!"
      });
    }
    let book = await Book.findOne({
      _id: req.params.bookId
    });
    if (!book) return res.status(404).send({
      message: "Book not found!"
    });
    if (!group.books.includes(book._id)) {
      group.books.push(book._id);
      await group.save();
    }
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.put("/remove/:groupId/:bookId", validUser, async (req, res) => {
  try {
    let group = await Group.findOne({
      _id: req.params.groupId
    });
    if (!group) return res.status(404).send({
      message: "Group not found!"
    });
    if (group.owner !== req.user._id) {
      return res.status(403).send({
        message: "Only the owner may remove books from a group!"
      });
    }
    let book = await Book.findOne({
      _id: req.params.bookId
    });
    if (!book) return res.status(404).send({
      message: "Book not found!"
    });
    if (!group.books.includes(book._id)) {
      let index = group.books.indexOf(book._id);
      group.books.splice(index, 1);
      await group.save();
    }
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

module.exports = {
  routes: router,
  model: Group
}


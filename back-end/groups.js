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
  members: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  books: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Book'
  }],
  admin: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});


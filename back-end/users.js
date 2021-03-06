const express = require("express");
const mongoose = require('mongoose');
const argon2 = require("argon2");

const router = express.Router();

const books = require('./books.js');
const Book = books.model;

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: String,
  password: String,
  favorites: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Book'
  }]
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password'))
    return next();
  
  try {
    const hash = await argon2.hash(this.password);
    this.password = hash;
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
});

userSchema.methods.comparePassword = async function(password) {
  try {
    const isMatch = await argon2.verify(this.password, password);
    return isMatch;
  } catch (error) {
    return false;
  }
};

userSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  return obj;
}

const User = mongoose.model('User', userSchema);

const validUser = async (req, res, next) => {
  if (!req.session.userID)
    return res.status(403).send({
      message: "not logged in"
    });
  try {
    const user = await User.findOne({
      _id: req.session.userID
    }).populate('favorites');
    if (!user) {
      return res.status(403).send({
        message: "not logged in"
      });
    }
    req.user = user;
  } catch (error) {
    return res.status(403).send({
      message: "not logged in"
    });
  }

  next();
}

router.post('/', async (req, res) => {
  if (!req.body.firstName || !req.body.lastName || !req.body.username || !req.body.password)
    return res.status(400).send({
      message: "first name, last name, username, and passwordare required"
    });
  
  try {
    const existingUser = await User.findOne({
      username: req.body.username
    });
    if (existingUser)
      return res.status(403).send({
        message: "username already exists"
      });
    
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      password: req.body.password
    });
    await user.save();
    req.session.userID = user._id;
    return res.send({
      user: user
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.post('/login', async (req, res) => {
  if (!req.body.username || !req.body.password)
    return res.sendStatus(400);
  
  try {
    const user = await User.findOne({
      username: req.body.username
    });
    if (!user)
      return res.status(403).send({
        message: "username or password is wrong"
      });

    if (!await user.comparePassword(req.body.password))
      return res.status(403).send({
        message: "username or password is wrong"
      });

    req.session.userID = user._id;

    return res.send({
      user: user
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.get('/', validUser, async (req, res) => {
  try {
    res.send({
      user: req.user
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.delete("/", validUser, async (req, res) => {
  try {
    req.session = null;
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.put("/fave/:id", validUser, async (req, res) => {
  try {
    let book = await Book.findOne({
      _id: req.params.id
    });
    if (!book)
      return res.status(404).send({
        message: "Book not found!"
      });
    let user = await User.findOne({
      _id: req.user._id
    })
    if (!user.favorites.map(fave => fave._id).includes(book._id)) {
      user.favorites.push(book);
      await user.save();
    }
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.put("/unfave/:id", validUser, async (req, res) => {
  try {
    let book = await Book.findOne({
      _id: req.params.id
    });
    if (!book)
      return res.status(404).send({
        message: "Book not found!"
      });
    let user = await User.findOne({
      _id: req.user._id
    })
    if (user.favorites.map(fave => fave._id).includes(book._id)) {
      let index = user.favorites.indexOf(book);
      user.favorites.splice(index, 1);
      await user.save();
    }
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

module.exports = {
  routes: router,
  model: User,
  valid: validUser
};
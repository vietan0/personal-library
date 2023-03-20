'use strict';

const Book = require('../models/Book');

module.exports = function (app) {
  app
    .route('/api/books')
    .get(async function (req, res) {
      const books = await Book.find({});
      res.json(books);
    })

    .post(async function (req, res) {
      if (Object.entries(req.body).length === 0 || req.body.title === '')
        res.send('missing required field title');
      else {
        const newBook = await Book.create({ title: req.body.title });
        res.json(newBook);
      }
    })

    .delete(async function (req, res) {
      try {
        await Book.deleteMany({});
        res.send('complete delete successful');
      } catch (err) {
        if (err.message.includes('Cast to ObjectId failed')) res.send('no book exists');
        else res.json({ err: err.message });
      }
    });

  app
    .route('/api/books/:id')
    .get(async function (req, res) {
      const { id } = req.params;
      try {
        const book = await Book.findById(id);
        if (!book) res.send('no book exists');
        else res.json(book);
      } catch (err) {
        if (err.message.includes('Cast to ObjectId failed')) res.send('no book exists');
        else res.json({ err: err.message });
      }
    })

    .post(async function (req, res) {
      let { id } = req.params;
      let { comment } = req.body;
      try {
        const book = await Book.findById(id);
        if (!book) res.send('no book exists');
        else if (!comment) res.send('missing required field comment');
        else {
          book.comments.push(comment);
          book.commentcount += 1;
          book.save();
          res.json(book);
        }
      } catch (err) {
        if (err.message.includes('Cast to ObjectId failed')) res.send('no book exists');
        else res.json({ err: err.message });
      }
    })

    .delete(async function (req, res) {
      let { id } = req.params;
      const toBeDeleted = await Book.findById(id);
      if (!toBeDeleted) res.send('no book exists');
      else {
        try {
          await Book.findByIdAndDelete(id);
          res.send('delete successful');
        } catch (err) {
          if (err.message.includes('Cast to ObjectId failed')) res.send('no book exists');
          else res.json({ err: err.message });
        }
      }
    });
};

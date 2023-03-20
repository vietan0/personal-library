const { Schema, model } = require('mongoose');

const bookSchema = new Schema({
  comments: [String],
  commentcount: {
    type: Number,
    default: 0,
  },
  title: {
    type: String,
    required: true,
  },
});

const Book = model('Book', bookSchema);

module.exports = Book;

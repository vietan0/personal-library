const mongoose = require('mongoose');
const Book = require('./models/Book');

async function connectDB(uri) {
  mongoose.set('strictQuery', false);
  mongoose.connect(uri);
  await Book.deleteMany({});
  await Book.create([{ title: 'example book' }, { title: 'example book 2' }]);
  console.log('Connected to database!');
}

module.exports = connectDB;

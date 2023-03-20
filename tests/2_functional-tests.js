const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const Book = require('../models/Book');

chai.use(chaiHttp);

suite('Functional Tests', function () {
  const url = '/api/books';

  suite('Suite: Routing tests', function () {
    suite('Suite: POST /api/books', function () {
      test('Test POST /api/books with title', function (done) {
        chai
          .request(server)
          .post(url)
          .send({ title: 'Harry Potter and the Pronouns' })
          .end((err, res) => {
            assert.include(res.body, { title: 'Harry Potter and the Pronouns' });
            assert.property(res.body, '_id');
            done();
          });
      });
      test('Test POST /api/books with no title given', function (done) {
        chai
          .request(server)
          .post(url)
          .end((err, res) => {
            assert.equal(res.text, 'missing required field title');
            done();
          });
      });
    });

    suite('Suite: GET /api/books', function () {
      test('Test GET /api/books', function (done) {
        chai
          .request(server)
          .get(url)
          .end(function (err, res) {
            assert.isArray(res.body, 'response should be an array');
            assert.property(
              res.body[0],
              'commentcount',
              'Books in array should contain commentcount',
            );
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
          });
      });
    });

    suite('Suite GET /api/books/[id]', function () {
      test('Test GET /api/books/[id] with id not in db', function (done) {
        chai
          .request(server)
          .get(`${url}/5`)
          .end(function (err, res) {
            assert.equal(res.text, 'no book exists');
            done();
          });
      });

      test('Test GET /api/books/[id] with valid id in db', function (done) {
        Book.findOne({ title: 'example book' }).then((book) => {
          chai
            .request(server)
            .get(`${url}/${book.id}`)
            .end(function (err, res) {
              assert.containsAllKeys(res.body, ['title', '_id', 'comments', 'commentcount']);
              done();
            });
        });
      });
    });

    suite('Suite POST /api/books/[id]', function () {
      test('Test POST /api/books/[id] with comment', function (done) {
        Book.findOne({ title: 'example book' }).then((book) => {
          chai
            .request(server)
            .post(`${url}/${book.id}`)
            .send({ comment: 'i have a comment' })
            .end(function (err, res) {
              assert.equal(res.body.comments[0], 'i have a comment');
              done();
            });
        });
      });

      test('Test POST /api/books/[id] without comment field', function (done) {
        Book.findOne({ title: 'example book' }).then((book) => {
          chai
            .request(server)
            .post(`${url}/${book.id}`)
            .end(function (err, res) {
              assert.equal(res.text, 'missing required field comment');
              done();
            });
        });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function (done) {
        chai
          .request(server)
          .post(`${url}/6418c6dc6d8509fa47a02a80`)
          .end(function (err, res) {
            assert.equal(res.text, 'no book exists');
            done();
          });
      });
    });

    suite('Suite DELETE /api/books/[id]', function () {
      test('Test DELETE /api/books/[id] with valid id in db', function (done) {
        Book.findOne({ title: 'example book' }).then((book) => {
          chai
            .request(server)
            .delete(`${url}/${book.id}`)
            .end(function (err, res) {
              assert.equal(res.text, 'delete successful');
              done();
            });
        });
      });

      test('Test DELETE /api/books/[id] with id not in db', function (done) {
        chai
          .request(server)
          .delete(`${url}/6418c6dc6d8509fa47a02a80`)
          .end(function (err, res) {
            assert.equal(res.text, 'no book exists');
            done();
          });
      });

      test('Test DELETE /api/books', function (done) {
        chai
          .request(server)
          .delete(url)
          .end(function (err, res) {
            assert.equal(res.text, 'complete delete successful');
            done();
          });
      });
    });
  });
});

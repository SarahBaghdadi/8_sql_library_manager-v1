var express = require('express');
var router = express.Router();
const Book = require('../models').Book;

/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(err){
      // Forward error to the global error handler
      console.log('Error from index.js')
      next(err);
    }
  }
}

// get /books - Shows the full list of books
router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll({ order: [["createdAt", "DESC"]] });
  res.render('index', { books, title: 'Books' });
}));

// get /books/new - Shows the create new book form
router.get('/books/new', asyncHandler(async (req, res) => {
  res.render('new-book');
}));

// post /books/new - Posts a new book to the database
router.post('/books/new', asyncHandler(async (req, res) => {
  const book = await Book.create(req.body);
  console.log(req.body);
  res.redirect('/books/' + book.id);
}));

// get /books/:id - Shows book detail form
router.get('/books/:id', asyncHandler(async (req, res) => {
  res.locals.statusMessage= '';
  const book = await Book.findByPk(req.params.id);
  res.render('edit-book', { book});
}));

// post /books/:id - Updates book info in the database
router.post('/books/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  await book.update(req.body);
  res.locals.statusMessage= `Updated ${book.title}`;
  console.log(res.locals.statusMessage);
  res.redirect('/books/' + book.id);
}));

// post /books/:id/delete - Deletes a book. Careful, this can’t be undone. It can be helpful to create a new “test” book to test deleting
router.post('/books/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  await book.destroy(req.body);
  res.locals.statusMessage= `Deleted ${book.title}`;
  console.log(res.locals.statusMessage);
  res.redirect('/');
}));
module.exports = router;

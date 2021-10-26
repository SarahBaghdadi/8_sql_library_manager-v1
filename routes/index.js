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
      next(err);
    }
  }
}

// get / - Redirects to /books
router.get('/', asyncHandler(async (req, res) => {
  res.redirect('/books');
}));

// get /books - Shows the full list of books
router.get('/books', asyncHandler(async (req, res) => {
  const books = await Book.findAll({ order: [["createdAt", "DESC"]] });
  res.render('index', { books, title: 'Books' });
}));

// get /books/new - Shows the create new book form
router.get('/books/new', asyncHandler(async (req, res) => {
  res.render('new-book');
}));

// post /books/new - Posts a new book to the database
router.post('/books/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect('/books/' + book.id);
  } catch (error) {
    if (error.name === "SequelizeValidationError") { 
      book = await Book.build(req.body);
      res.render("new-book", { book, errors: error.errors })
    } else {
      throw error;
    }
  }
}));

// get /books/:id - Shows book detail form
router.get('/books/:id', asyncHandler(async (req, res) => {
  res.locals.statusMessage= '';
  const book = await Book.findByPk(req.params.id);
  res.render('update-book', { book});
}));

// post /books/:id - Updates book info in the database
router.post('/books/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    await book.update(req.body);
    console.log('updated', book)
    res.redirect(`/books/${book.id}`);
  } catch (error) {
    if (error.name === "SequelizeValidationError") { 
      console.log('error updating', book);
      res.render("update-book", { book, errors: error.errors })
    } else {
      throw error;
    }
  }
}));

// post /books/:id/delete - Deletes a book. Careful, this can’t be undone. It can be helpful to create a new “test” book to test deleting
router.post('/books/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  await book.destroy(req.body);
  res.locals.statusMessage= `Deleted ${book.title}`;
  res.redirect('/');
}));
module.exports = router;

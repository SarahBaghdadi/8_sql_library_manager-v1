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

/* GET home page. */
router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll({ order: [["createdAt", "DESC"]] });
  res.render('index', { books, title: 'Books' });
}));


module.exports = router;

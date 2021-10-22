/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

module.exports = function (app) {
  
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://hoopla:XxfQnridOJlUHvkC@cluster0.jk4rw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const { Schema } = mongoose;

var bookSchema = new mongoose.Schema({
  title: String,
  commentcount: { type: Number, default: 0},
  comments: [String]
});

var BookModel = mongoose.model('BookModel', bookSchema);

  app.route('/api/books')
    .get(function (req, res){
      // GET an array of book objects
      // json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      BookModel.find({  }, 'title _id commentcount', function(err, result) {
        if (err) return console.log(err);
        return res.json(result);
      })
    })
    
    .post(function (req, res){
      // If title is not included in the request, the returned response should be the string 'missing required field title'
      if (!req.body.title) return res.send('missing required field title');
      let title = req.body.title;
      
      // response will contain new book object including at least _id and title
      BookModel.create({ title: title }, function(err, result) {
        if (err) return console.log(err);
        console.log(result);
        return res.json(result);
      });
      
      // return res.json({ 'post': title });
    })
    
    .delete(function(req, res){
      // delete all books
      // if successful response will be 'complete delete successful'
      BookModel.deleteMany({  }, function(err, result) {
        if (err) return console.log(err);
        console.log(result);
        return res.send('complete delete successful');
       });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      // json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      BookModel.findById(bookid, '_id title comments', function(err, result) {
        if (err) return console.log(err);
        // If no book is found, return the string no book exists.
        if (!result) return res.send('no book exists');
        return res.json(result);
      })
      // return res.json({ 'get bookid': bookid });
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      // if comment not included, return 'missing required field'
      if (!req.body.comment) return res.send('missing required field');
      let comment = req.body.comment;
      // add comment to a specific book 
      // json res format same as .get: {"_id": bookid, "title": book_title, "commentcount": num_of_comments },...
      BookModel.findById(bookid, function(err, result) {
        if (err) return console.log(err);
        // if no book found, return 'no book exists'
        if (!result) return res.send('no book exists');
        result.comments.push(comment);
        result.commentcount += 1;
        result.save();
        return res.json(result);
      });

      // return res.json({ 'post to bookid': bookid , 'comment': comment });
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      // delete specific book
      // if successful response will be 'delete successful'
      BookModel.findByIdAndRemove(bookid, function(err, result) {
        if (err) return console.log(err);
        // if no book found, return 'no book exists'
        if (!result) return res.send('no book exists');
        return res.send('delete successful');
      })
      // return res.json({ 'delete bookid': bookid });
    });
  
};

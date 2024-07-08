const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user -- Task 6
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop -- Task 1 
public_users.get('/',function (req, res) {
  return res.send(books);
});

// Get book details based on ISBN -- Task 2
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.send(books[isbn]);
 });
  
// Get book details based on author -- Task 3
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  Object.keys(books).forEach(key => {
    let thisAuthor = books[key].author;
    let author_nospace = thisAuthor.replace(/\s+/g, '');  
    if (author_nospace == author) {
        return res.send(books[key]);        
    }
  });
});

// Get all books based on title -- Task 4
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    Object.keys(books).forEach(key => {
      let thisTitle = books[key].title;
      let title_nospace = thisTitle.replace(/\s+/g, '');  
      if (title_nospace == title) {
          return res.send(books[key]);        
      }
    });
  });

//  Get book review -- Task 5
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.send(books[isbn].reviews);
});

module.exports.general = public_users;
const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ 
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}


//only registered users can login -- Task 7
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review --- Task 8
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review_content = req.body.review;
  const review_writer = req.body.username;
  const review = {
    "writer" : review_writer,
    "content" : review_content
  }
  let book = books[isbn]
  if (book) {  // Check if friend exists
    if (review) {
        book["reviews"] = review;
    }
    books[isbn] = book;  
        res.send(`Review of book with the ISBN ${isbn} updated by ${review_writer}.`);
    } else {
        // Respond if friend with specified email is not found
        res.send("Unable to find book!"); 
    }     
});

// Delete a book review --- Task 9
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const user = req.body.username;
    let book = books[isbn];
    let review_writer = books[isbn].reviews.writer;
    if (book) {  
      if (user === review_writer) {
          delete book["reviews"];
          res.send(`Review of book with the ISBN ${isbn} deleted by ${user}.`);
      } else {
          res.send(`Cannot delete other user review.`);
      }    
    } else {
        res.send("Unable to find book!"); 
    }     
});
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
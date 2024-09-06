// app.js
import express from "express";
import bodyParser from "body-parser";
import { dirname } from 'path';
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express();
const port = 3000;
let isUserAuthorised = false;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Store posts in an array (non-persistent)
let posts = [];


function passwordChecker(req, res, next) {
  const password = req.body['password'];
  if(password === 'ilove2program'){
    isUserAuthorised = true;
    next();
  } else {
    isUserAuthorised = false;
    res.render('login', { message: 'Incorrect password, please try again'})
  }

}

// Home route - Display all posts
app.get('/', (req, res) => {
  res.render('login', {message: null});
});

app.post("/index",passwordChecker, (req,res) => {
  res.render('index', { posts });
});

app.get('/index', (req, res) => {
   if(isUserAuthorised){
    res.render('index', { posts });
   } else {
    res.redirect('/');
   }
})

// New post form route
app.get('/new', (req, res) => {
  res.render('new-post');
});

// Handle new post submission
app.post('/new', (req, res) => {
  const newPost = {
    title: req.body.title,
    content: req.body.content,
  };
  posts.push(newPost);
  res.redirect('/index');
});

// View individual post
app.get('/post/:id', (req, res) => {
  const postId = req.params.id;
  const post = posts[postId];
  if (post) {
    res.render('post', { post: post });
  } else {
    res.send('Post not found!');
  }
});

app.listen(port, () => {
  console.log(`Blog app listening at http://localhost:${port}`);
});

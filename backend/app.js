const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const mongoConf = process.env.MONGO_CONFIG_URL;

const Post = require('./models/post');

const app = express();

mongoose.connect(mongoConf, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to DB!");
  })
  .catch(() => {
    console.log(" Unable to connect to DB...");
  })


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

/* MANUAL CORS */
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
//   next();
// });


/* Add a post in DB */
app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save()
      .then(result =>{
        res.status(201).json({
          message: "Posts added",
          postId :result._id
        });
      });
});

/* Get all the posts from DB */
app.get('/api/posts',(req, res, next)=>{
  Post.find()
    .then(documents => {
      console.log(documents);
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: documents
      });
    });
});

/* Update the post corresponding to the param id passed through URL from DB */
app.put('/api/posts/:id', (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  })
  Post.updateOne({_id: req.params.id}, post)
    .then(result => {
      res.status(200).json(`Update successful ! ${result}`)
    })
});

/* Delete the post corresponding to the param id passed through URL from DB */
app.delete('/api/posts/:id', (req, res, next) =>{
  Post.deleteOne({_id: req.params.id})
      .then((results) =>{
        console.log(results);
        res.status(200).json({message: "post deleted!"})
      })
});

module.exports = app;

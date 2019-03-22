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

app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save();
  res.status(201).json({
    message: "Posts added"
  });
});

app.get('/api/posts',(req, res, next)=>{
  const posts = [
    {id :"fake2fp", title: "First server-side post", content: " This comes from the server"},
    {id :"fake1fp", title: "Second server-side post", content: " This comes from the server too"}
  ];
  res.status(200).json({
    message: "Posts fetched successfully!",
    posts
  });
});

module.exports = app;

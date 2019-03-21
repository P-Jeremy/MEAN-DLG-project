const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

app.post('/api/posts', (req, res, next) => {
  const posts = req.body
  console.log(posts);
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

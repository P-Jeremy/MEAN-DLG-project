const express = require('express');

const app = express();

app.use('/api/posts',(req, res, next)=>{
  const posts = [
    
  ];
  res.json();
});

module.exports = app;

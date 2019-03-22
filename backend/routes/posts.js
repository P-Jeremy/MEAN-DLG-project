const express=require('express');

const Post = require('../models/post');

const router = express.Router();

/* Add a post in DB */
router.post('',(req, res, next) => {
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
router.get('',(req, res, next)=>{
  Post.find()
    .then(documents => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: documents
      });
    });
});

/* Update the post corresponding to the param id passed through URL from DB */
router.put('/:id', (req, res, next) => {
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

/* Get a post corresponding to the param id from DB */
router.get('/:id', (req,res,next) => {
  Post.findById(req.params.id)
      .then(post => {
        if (post) {
          res.status(200).json(post);
        } else {
          res.status(404).json({message: 'Post not found'})
        }
      })
})

/* Delete the post corresponding to the param id passed through URL from DB */
router.delete('/:id', (req, res, next) =>{
  Post.deleteOne({_id: req.params.id})
      .then((results) =>{
        res.status(200).json({message: `Post deleted ${results}`})
      })
});

module.exports = router;

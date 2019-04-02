const express=require('express');

const Post = require('../models/post');
const multer = require('multer');
const multerS3 = require('multer-s3');

const router = express.Router();
const aws =require('aws-sdk');

const checkAuth = require('../helpers/check-auth')

const s3Password = process.env.AWS_KEY;
const s3Id = process.env.AWS_ID;
const bucket = process.env.BUCKET;


const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
};

aws.config.update({
  secretAccessKey: s3Password,
  accessKeyId: s3Id
});

const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: bucket,
    acl: 'public-read',
    metadata: function (req, file, cb) {
      const isValid = MIME_TYPE_MAP[file.mimetype];
      let error = new Error('Invalid mime type');
      if (isValid) {
        error = null;
      }
      cb(error, {fieldName: file.fieldname});
    },
    key: (req, file, cb) => {
      const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, name + '-' + Date.now()+ '.'+ ext);
    }
  })
})

/* Add a post in DB */
router.post('', checkAuth , upload.single('image'), (req, res, next) => {

  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    image: req.file.location
  });
  post.save()
      .then(result =>{
        res.status(201).json({
          message: "Posts added :)",
          post: {
            id: result._id,
            title: result.title,
            content: result.content,
            image: result.image
          }
        });
      });
  });



/* Get all the posts from DB */
router.get('',(req, res, next)=>{
  const pageSize = +req.query.pageSize; // The '+' allows to use the query as a number instead of a string
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPost;
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPost = documents
      return Post.countDocuments();
      })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched !",
        posts: fetchedPost,
        maxPosts: count
      })
    })
});

/* Update the post corresponding to the param id passed through URL from DB */
router.put('/:id', checkAuth, upload.single('image'), (req, res, next) => {
  let imagePath;
  if (req.file) {
    imagePath = req.file.location
  } else {
    imagePath = req.body.image
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    image: imagePath
  })
  console.log(post);

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
router.delete('/:id', checkAuth, (req, res, next) =>{
  Post.deleteOne({_id: req.params.id})
      .then((results) =>{
        res.status(200).json({message: `Post deleted ${results}`})
      })
});

module.exports = router;

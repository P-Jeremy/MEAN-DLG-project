const express=require('express');
const router = express.Router();
const postController = require('../controllers/post');
const checkAuth = require('../helpers/check-auth');
const upload = require('../helpers/upload');


/* Add a post in DB */
router.post('', checkAuth , upload.single("image"), postController.addPost);

/* Add a comment in DB */
router.post('/comment/:id', checkAuth , postController.addComment);

/* Get all the posts from DB */
router.get('', postController.getPosts);

/* Update the post corresponding to the param id passed through URL from client */
router.put('/:id', checkAuth, upload.single("image"), postController.updatePost);

/* Get a post corresponding to the param id from client */
router.get('/:id', postController.getSinglePost);

/* Delete the post corresponding to the param id passed through URL from client */
router.delete('/:id', checkAuth, postController.deletePost);


module.exports = router;

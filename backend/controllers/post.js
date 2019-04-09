const Post = require("../models/post");

exports.addPost = async (req, res, next) => {
  try {
    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
      image: req.file.location,
      creator: req.userData.userId
    });
    const result = await newPost.save();
    return res.status(201).json({
      message: "Post crée avec succès",
      post: {
        id: result._id,
        title: result.title,
        content: result.content,
        image: result.image,
        creator: result.userId
      }
    });
  } catch {
    return res.status(500).json({
      message: "La création du post à échoué..."
    });
  }
};

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pageSize; // The '+' allows to use the query as a number instead of a string
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPost;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPost = documents;
      return Post.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched !",
        posts: fetchedPost,
        maxPosts: count
      });
    });
};

exports.updatePost = async (req, res, next) => {
  let imagePath;
  if (req.file) {
    imagePath = req.file.location;
  } else {
    imagePath = req.body.image;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    image: imagePath,
    creator: req.userData.userId
  });
  const result = await Post.updateOne(
    { _id: req.params.id, creator: req.userData.userId },
    post
  );
  if (result.nModified > 0) {
    res.status(200).json(`Update successful ! ${result}`);
  } else {
    res.status(401).json({ message: `Impossible de modifier ce post...` });
  }
};

exports.getSinglePost = (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post non trouvé" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "La modification du post à échoué..."
      });
    });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      if (result.n > 0) {
        res.status(200).json(`Deletion successful ! ${result}`);
      } else {
        res
          .status(401)
          .json({ message: `Vous n'êtes pas authorisé à modifier ce post` });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "La suppression du post à échoué..."
      });
    });
};

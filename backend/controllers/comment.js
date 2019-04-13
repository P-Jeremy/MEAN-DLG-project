const Post = require("../models/post");
const Comment = require("../models/comment");

exports.addComment = async (req, res, next) => {
  const fetchedUser = await User.findById({ _id: req.userData.userId });
  if (!fetchedUser || !fetchedUser.isActive) {
    return res.status(403).json({
      message: "Cet utilisateur ne possède pas de compte actif"
    });
  }
  try {
    const newComment = new Comment({
      content: req.body.content,
      creator_id: req.userData.userId,
      post_id: req.params.id
    });
    const result = await newComment.save();
    return res.status(201).json({
      message: "Commentaire crée avec succès",
      comment: {
        id: result._id,
        content: result.content,
        creator_id: result.userId,
        post_id: result.id
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "La création du commentaire à échoué..."
    });
  }
};

exports.getComments = async (req, res, next) => {
  const results = await Comment.find()
      res.status(200).json({
        message: "Comments fetched !",
        comments: results,
      });
};


// exports.getSinglePost = (req, res, next) => {
//   Post.findById(req.params.id)
//     .then(post => {
//       if (post) {
//         res.status(200).json(post);
//       } else {
//         res.status(404).json({ message: "Post non trouvé" });
//       }
//     })
//     .catch(error => {
//       res.status(500).json({
//         message: "La modification du post à échoué..."
//       });
//     });
// };

// exports.deleteComment = (req, res, next) => {
//   Comment.deleteOne({ _id: req.params.id, creator_id: req.userData.userId })
//     .then(result => {
//       if (result.n > 0) {
//         res.status(200).json(`Deletion successful ! ${result}`);
//       } else {
//         res
//           .status(401)
//           .json({ message: `Vous n'êtes pas authorisé à modifier ce post` });
//       }
//     })
//     .catch(error => {
//       res.status(500).json({
//         message: "La suppression du post à échoué..."
//       });
//     });
// };

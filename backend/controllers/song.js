const Song = require("../models/song");

exports.addSong = async (req, res, next) => {
  console.log(req.files.lyrics[0].location);

  try {
    const newSong = new Song({
      title: req.body.title,
      author: req.body.author,
      lyrics: req.files.lyrics[0].location,
      tab: req.files.tab[0].location
    });
    const result = await newSong.save();
    return res.status(201).json({
      message: "Chanson crée avec succès",
      song: {
        id: result._id,
        title: result.title,
        author: result.author,
        lyrics: result.lyrics,
        tab: result.tab
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "La création de la chanson à échoué..."
    });
  }
};

exports.getSongs = (req, res, next) => {
  const pageSize = +req.query.pageSize; // The '+' allows to use the query as a number instead of a string
  const currentPage = +req.query.page;
  const songQuery = Song.find();
  let fetchedSong;
  if (pageSize && currentPage) {
    songQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  songQuery
    .then(documents => {
      fetchedSong = documents;
      return Song.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: "Songs fetched !",
        songs: fetchedSong,
        maxSongs: count
      });
    });
};

// exports.updatePost = async (req, res, next) => {
//   let imagePath;
//   if (req.file) {
//     imagePath = req.file.location;
//   } else {
//     imagePath = req.body.image;
//   }
//   const post = new Post({
//     _id: req.body.id,
//     title: req.body.title,
//     content: req.body.content,
//     image: imagePath,
//     creator: req.userData.userId
//   });
//   const result = await Post.updateOne(
//     { _id: req.params.id, creator: req.userData.userId },
//     post
//   );
//   if (result.n > 0) {
//     res.status(200).json(`Update successful ! ${result}`);
//   } else {
//     res.status(401).json({ message: `Impossible de modifier ce post...` });
//   }
// };

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

// exports.deletePost = (req, res, next) => {
//   Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
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

const Song = require("../models/song");

exports.addSong = async (req, res, next) => {
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

exports.updateSong = async (req, res, next) => {
  const isAdmin = req.userData.isAdmin;
  if (!isAdmin) {
    return res.status(403).json({
      message: 'Vous n\'êtes pas authorisé'
    })
  }
  const lyricsPath = req.files.lyrics ? req.files.lyrics[0].location :req.body.lyrics;
  const tabPath = req.files.tab ? req.files.tab[0].location :req.body.tab;
  const song = new Song({
    _id: req.body.id,
    title: req.body.title,
    author: req.body.author,
    lyrics: lyricsPath,
    tab: tabPath
  });
  const result = await Song.updateOne(
    { _id: req.params.id},
    song
  );
  if (result.n > 0) {
    res.status(200).json(`Update successful ! ${result}`);
  } else {
    res.status(401).json({ message: `Impossible de modifier ce titre...` });
  }
};

exports.getSingleSong = (req, res, next) => {
  Song.findById(req.params.id)
    .then(song => {
      if (song) {
        res.status(200).json(song);
      } else {
        res.status(404).json({ message: "Titre non trouvé" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "La modification du titre à échoué..."
      });
    });
};

exports.deleteSong = (req, res, next) => {
  const isAdmin = req.userData.isAdmin;
  console.log(isAdmin);

  if (!isAdmin) {
    return res
    .status(403)
    .json({ message: `Vous n'êtes pas authorisé à modifier ce titre` });
  } else {
    Song.deleteOne({ _id: req.params.id})
    .then(result => {
      if (result.n > 0) {
        res.status(200).json(`Deletion successful ! ${result}`);
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "La suppression du titre à échoué..."
      });
    });
  }
};

const Song = require("../models/song");
const User = require("../models/user");
const Tag = require("../models/tag");
const sendMail = require("../helpers/email/sendMail");
const titleNotif = require("../helpers/email/templates/titleNotif");

exports.addSong = async (req, res, next) => {
  try {
    const tab = req.file ? req.file.location : null;

    const newSong = new Song({
      title: req.body.title,
      author: req.body.author,
      lyrics: req.body.lyrics,
      tab: tab
    });

    const result = await newSong.save();
    const users = await User.find({ titleNotif: true });
    await users.map(user => {
      sendMail(titleNotif(user.email, result.title));
    });
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

exports.getSongs = async (req, res, next) => {
  try {
    const songs = await Song.find();
    return res.status(200).json({
      message: "Songs fetched !",
      songs: songs
    });
  } catch (error) {
    res.status(500).json({
      message: "Impossible de charger la setlist"
    });
  }
};

exports.updateSong = async (req, res, next) => {
  const isAdmin = req.userData.isAdmin;
  if (!isAdmin) {
    return res.status(403).json({
      message: "Vous n'êtes pas authorisé"
    });
  }

  let tabPath;
  if (req.file) {
    tabPath = req.file.location;
  } else {
    tabPath = !req.body.tab ? null : req.body.tab;
  }

  const song = new Song({
    _id: req.body.id,
    title: req.body.title,
    author: req.body.author,
    lyrics: req.body.lyrics,
    tab: tabPath
  });

  const result = await Song.updateOne({ _id: req.params.id }, song);
  if (result.n > 0) {
    res.status(200).json(`Update successful ! ${result}`);
  } else {
    res.status(401).json({ message: `Impossible de modifier ce titre...` });
  }
};

exports.getSingleSong = async (req, res, next) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      res.status(404).json({ message: "Titre non trouvé" });
    }
    res.status(200).json(song);
  } catch (error) {
    res.status(500).json({
      message: "Une erreur est survenue..."
    });
  }
};

exports.deleteSong = (req, res, next) => {
  const isAdmin = req.userData.isAdmin;
  if (!isAdmin) {
    return res
      .status(403)
      .json({ message: `Vous n'êtes pas authorisé à modifier ce titre` });
  } else {
    Song.deleteOne({ _id: req.params.id })
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

exports.addTags = async (req, res, next) => {
  const isAdmin = req.userData.isAdmin;
  if (!isAdmin) {
    return res
      .status(403)
      .json({ message: `Vous n'êtes pas authorisé à ajouter une playlist` });
  }
  try {
    const tagExists = await Tag.find({ name: req.body.title });
    if (tagExists.length) {
      return res.status(403).json({
        message: "Cette playlist existe déjà"
      });
    }
    const tag = new Tag({
      name: req.body.title
    }).save();
    return res.status(201).json({
      message: "Liste crée avec succès",
      tag: tag.title
    });
  } catch (error) {
    res.status(500).json({
      message: "Une erreur est survenue..."
    });
  }
};

exports.getTags = async (req, res, next) => {
  try {
    const tags = await Tag.find();
    return res.status(200).json({
      message: "Tags fetched !",
      tags: tags
    });
  } catch (error) {
    res.status(500).json({
      message: "Impossible de charger les listes"
    });
  }
};

const express=require('express');
const router = express.Router();
const songController = require('../controllers/song');
const checkAdmin = require('../helpers/check-admin');
const checkAuth = require('../helpers/check-auth');
const upload = require('../helpers/upload');


/* Add a song in DB */
router.post('', checkAdmin , upload.fields([{name: "lyrics", maxCount :1}, {name: "tab", maxCount :1}]), songController.addSong);

/* Get all the songs from DB */
router.get('', checkAuth, songController.getSongs);

/* Get a random song from DB */
router.get('/:shuffle', checkAuth, songController.getShuffleSong);

/* Update the song corresponding to the param id passed through URL from client */
router.put('/:id', checkAdmin, upload.fields([{name: "lyrics", maxCount :1}, {name: "tab", maxCount :1}]), songController.updateSong);

/* Get a song corresponding to the param id from client */
router.get('/:id', songController.getSingleSong);

/* Delete the song corresponding to the param id passed through URL from client */
router.delete('/:id', checkAdmin, songController.deleteSong);


module.exports = router;

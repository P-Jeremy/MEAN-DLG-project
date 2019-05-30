const express=require('express');
const router = express.Router();
const songController = require('../controllers/song');
const checkAdmin = require('../helpers/check-admin');
const upload = require('../helpers/upload');


/* Add a song in DB */
router.post('', checkAdmin , upload.single('tab'), songController.addSong);

/* Get all the songs from DB */
router.get('', songController.getSongs);

/* Update the song corresponding to the param id passed through URL from client */
router.put('/edit:id', checkAdmin, upload.single('tab'), songController.updateSong);

/* Get a song corresponding to the param id from client */
router.get('/single:id', songController.getSingleSong);

/* Delete the song corresponding to the param id passed through URL from client */
router.delete('/:id', checkAdmin, songController.deleteSong);

/* Add a tag in DB */
router.post('/tags', checkAdmin, songController.addTags);

/* Get all the tags from DB */
router.get('/tags', songController.getTags);


module.exports = router;

const mongoose = require('mongoose');

const songSchema = mongoose.Schema({
  title: {type: String, required: true},
  author: {type: String, required: true},
  lyrics: {type: String, required: true},
  tab: {type: String, required: true},
});

module.exports = mongoose.model('Song', songSchema);

const mongoose = require('mongoose');

const backwardSchema = mongoose.Schema({
  name: {type: String, required: true},
});

backwardSchema.set('timestamps', true);

module.exports = mongoose.model('backward', backwardSchema);

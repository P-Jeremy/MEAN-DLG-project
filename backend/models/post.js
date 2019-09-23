const mongoose = require('mongoose');

const commentSchema  = mongoose.Schema({
  content: {type: String, required: true},
  creator_id : {type: String, required: true},
  creator_pseudo: {type: String, required: true},
})

commentSchema.set('timestamps', true);

const postSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  image: {type: String || null},
  comments: [commentSchema],
  isActive: { type: Boolean, required: true, default: true },
  creator_id: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  creator_pseudo: {type: String, ref: "User"}
});

postSchema.set('timestamps', true);

module.exports = mongoose.model('Post', postSchema);

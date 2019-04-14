const mongoose = require('mongoose');

const commentSchema  = mongoose.Schema({
  content: {type: String, required: true},
  creator_id : {type: String, required: true},
  creator_pseudo: {type: String, required: true},
  createdAt: { type: Date, default: Date.now, required: false },
  updatedAt: { type: Date, default: Date.now, required: false },
})

const postSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  image: {type: String, required: true},
  createdAt: { type: Date, default: Date.now, required: false },
  updatedAt: { type: Date, default: Date.now, required: false },
  comments: [commentSchema],
  creator_id: {type: mongoose.Schema.Types.ObjectId, ref: "User", required:true},
  creator_pseudo: {type: String, ref: "User", required:true}
});

module.exports = mongoose.model('Post', postSchema);

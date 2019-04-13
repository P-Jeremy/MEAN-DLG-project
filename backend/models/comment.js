const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  content: {type: String, required: true},
  createdAt: { type: Date, default: Date.now, required: false },
  updatedAt: { type: Date, default: Date.now, required: false },
  creator_id: {type: mongoose.Schema.Types.ObjectId, ref: "User", required:true},
  post_id: {type: mongoose.Schema.Types.ObjectId, ref: "Post", required:true}
});

module.exports = mongoose.model('Comment', commentSchema);

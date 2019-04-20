const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  pseudo: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, required: false, default: false },
  isAdmin: { type: Boolean, required: false, default: false },
  isDeleted: { type: Boolean, required: false, default: false },
  postNotif:{type: Boolean, required:true, default: true },
  commentNotif: {type: Boolean, required:true, default: true },
  titleNotif:{type: Boolean, required:true, default: true },
  avatar: { type: String || null }
});

userSchema.set("timestamps", true);

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);

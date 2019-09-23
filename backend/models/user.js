const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const tokenSchema  = mongoose.Schema({
  used_token: {type: String, required: true}
})

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  pseudo: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, required: false, default: false },
  isAdmin: { type: Boolean, required: false, default: false },
  isDeleted: { type: Boolean, required: false, default: false },
  postNotif:{type: Boolean, required:false, default: true },
  commentNotif: {type: Boolean, required:false, default: true },
  titleNotif:{type: Boolean, required:false, default: true },
  avatar: { type: String || null },
  tokens: [tokenSchema],
});

userSchema.set("timestamps", true);

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);

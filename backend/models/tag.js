const mongoose = require("mongoose");

const tagSchema =  mongoose.Schema({
  name: { type: String,required: true},
  isActive: {type: Boolean, default: true,}
});


module.exports= mongoose.model("Tag", tagSchema);

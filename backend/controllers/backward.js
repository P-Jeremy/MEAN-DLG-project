const backward = require("../models/backwards");
const User = require("../models/user");

exports.onServerLaunch = async (req, res, next) => {
  async function test() {
    console.log("test1");

    const result = await backward.find({ name: "3" });
    if (result.length > 0) {
      console.log("return1");

      return;
    } else {
      const newBackward = new backward({
        name: "3"
      });
      return newBackward.save();
    }
  }

  async function test2() {
    console.log("test2");

    const result = await backward.find({ name: "4" });
    if (result.length > 0) {
      console.log("return2");

      return;
    } else {
      const newBackward = new backward({
        name: "4"
      });
      return newBackward.save();
    }
  }
  await test();
  await test2();
}

exports.turnOffTitleNotif = async (req, res, next) => {
  const users = await User.find();
  const newStatus = { $set: { commentNotif: false } };

  return users.map(async e => {
    await User.findOneAndUpdate({ _id: e._id }, newStatus, {
      new: true
    });
  });
};

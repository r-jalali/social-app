const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  role: { type: String, enum: ["ADMIN", "USER"], default: "USER" },
});

const User = mongoose.model("User", userSchema);
User.createIndexes();
module.exports = User;

const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  pictureUrl: { type: String },
  role: { type: String, required: true, default: "user" },
  todos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Todo" }],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");

const todoSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
      minLength: [5, "Title too short (min. 5 characters)"],
      maxLength: [50, "Title too long (max. 100 characters)"],
    },
    notes: {
      type: String,
      required: true,
      minLength: [10, "Notes too short (min. 5 characters)"],
      maxLength: [200, "Notes too long (max. 100 characters)"],
    },
    complete: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Todo", todoSchema);

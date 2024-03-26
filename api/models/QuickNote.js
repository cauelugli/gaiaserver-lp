const mongoose = require("mongoose");

quicknoteSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const QuickNote = mongoose.model("QuickNote", quicknoteSchema);

module.exports = QuickNote;

const mongoose = require("mongoose");

quicknoteSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const QuickNote = mongoose.model("QuickNote", quicknoteSchema);

module.exports = QuickNote;

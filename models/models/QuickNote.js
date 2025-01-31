const { mongoose } = require("../db");

quicknoteSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const QuickNote = mongoose.model("QuickNote", quicknoteSchema);

module.exports = QuickNote;

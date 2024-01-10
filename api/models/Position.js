const mongoose = require("mongoose");

const positionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  members: {
    type: Array,
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Position = mongoose.model("Position", positionSchema);

module.exports = Position;

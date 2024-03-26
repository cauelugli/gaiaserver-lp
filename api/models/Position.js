const mongoose = require("mongoose");

const positionSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  members: {
    type: Array,
    default: []
  },
  name: {
    type: String,
    required: true,
  },
});

const Position = mongoose.model("Position", positionSchema);

module.exports = Position;

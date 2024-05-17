const { mongoose } = require("../db");

const positionSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  department: {
    type: Object,
    required: true,
  },
  members: {
    type: Array,
    default: [],
  },
  name: {
    type: String,
    required: true,
  },
});

const Position = mongoose.model("Position", positionSchema);

module.exports = Position;

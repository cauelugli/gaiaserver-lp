const { mongoose } = require("../db");

const positionSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  department: {
    type: String,
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
  status: {
    type: String,
    default: "Aberto",
  },
});

const Position = mongoose.model("Position", positionSchema);

module.exports = Position;

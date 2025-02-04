const { mongoose } = require("../db");

const logSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  label: {
    type: String,
  },
  source: {
    type: Object,
  },
  target: {
    type: Object,
  },
  targetModel: {
    type: String,
  },
  type: {
    type: String,
  },
});

const Log = mongoose.model("Log", logSchema);

module.exports = Log;

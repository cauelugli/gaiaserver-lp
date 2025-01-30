const { mongoose } = require("../db");

const groupSchema = new mongoose.Schema({
  creator: {
    type: String,
  },
  members: {
    type: Array,
  },
  name: {
    type: String,
  },
  status: {
    type: String,
    default: "Aberto",
  },
});

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;

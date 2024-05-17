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
});

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;

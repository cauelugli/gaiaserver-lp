const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  members: {
    type: Array,
  },
  creator: {
    type: String,
  },
});

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;

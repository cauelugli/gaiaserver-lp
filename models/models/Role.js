const { mongoose } = require("../db");

const roleSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  name: {
    type: String,
    required: true,
  },
  members: {
    type: Array,
    default: [],
  },
});

const Role = mongoose.model("Role", roleSchema);

module.exports = Role;

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
  status: {
    type: String,
    default: "Aberto",
  },
});

const Role = mongoose.model("Role", roleSchema);

module.exports = Role;

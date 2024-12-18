const { mongoose } = require("../db");

adminSchema = new mongoose.Schema({
  config: {
    type: Object,
    default: { notifyActivities: Boolean, default: false },
  },
  image: {
    type: String,
  },
  name: {
    type: String,
    default: "Admin",
  },
  notifications: {
    type: Array,
    default: [],
  },
  password: {
    type: String,
  },
  username: {
    type: String,
    default: "admin",
  },
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;

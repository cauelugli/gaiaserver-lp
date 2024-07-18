const { mongoose } = require("../db");

adminSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  name: {
    type: String,
    default: "Admin",
  },
  notifications: {
    type: Object,
    default: { 0: "" },
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

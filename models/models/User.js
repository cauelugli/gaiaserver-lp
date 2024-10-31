const { mongoose } = require("../db");

userSchema = new mongoose.Schema({
  agenda: {
    type: Array,
    default: [],
  },
  address: {
    type: String,
  },
  birthdate: {
    type: String,
  },
  cellphone: {
    type: String,
  },
  cpf: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  department: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
  },
  groups: {
    type: Array,
    default: []
  },
  image: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isFirstAccess: {
    type: Boolean,
    default: true,
  },
  isManager: {
    type: Boolean,
  },
  name: {
    type: String,
    required: true,
  },
  notifications: {
    type: Array,
    default: [],
  },
  password: {
    type: String,
  },
  phone: {
    type: String,
  },
  position: {
    type: String,
  },
  role: {
    type: String,
  },
  username: {
    type: String,
  },
  // social media 
  facebook: {
    type: String,
  },
  instagram: {
    type: String,
  },
  linkedin: {
    type: String,
  },
  x: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

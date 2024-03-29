const mongoose = require("mongoose");

const userPreferencesSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  userShortcuts: {
    type: Array,
    default: [
      {
        name: "Adicionar Job",
        isActive: true,
        action: "addJob",
      },
      {
        name: "Adicionar Venda",
        isActive: true,
        action: "addSale",
      },
      {
        name: "Atalho 3",
        isActive: false,
        action: "",
      },
      {
        name: "Atalho 4",
        isActive: false,
        action: "",
      },
      {
        name: "Atalho 5",
        isActive: false,
        action: "",
      },
    ],
  },
  toggles: {
    type: Array,
    default: [],
  },
});

const UserPreferences = mongoose.model(
  "UserPreferences",
  userPreferencesSchema
);

module.exports = UserPreferences;

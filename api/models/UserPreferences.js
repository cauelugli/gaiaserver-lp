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
        fullWidth: true,
        maxWidth: "lg",
      },
      {
        name: "Adicionar Venda",
        isActive: true,
        action: "addSale",
        fullWidth: true,
        maxWidth: "md",
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

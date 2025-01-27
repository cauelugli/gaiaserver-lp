const { mongoose } = require("../db");

const userPreferencesSchema = new mongoose.Schema({
  darkMode: {
    type: Boolean,
    default: false,
  },
  fontFamilyTitle: {
    type: Object,
  },
  fontFamilyRest: {
    type: Object,
  },
  paletteColor: {
    type: String,
  },
  barPosition: {
    type: Boolean,
    default: false,
  },
  tableOrCardView: {
    type: Boolean,
    default: false,
  },
  cardSize: {
    type: Number,
    default: 3,
  },
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

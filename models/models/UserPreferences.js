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
  homePageLayout: {
    type: String,
    default: "Padrão",
  },
  homePagePreferences: {
    type: Number,
    default: 0,
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
        action: "addJob",
        fullWidth: true,
        maxWidth: "lg",
      },
      {
        name: "Adicionar Venda",
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

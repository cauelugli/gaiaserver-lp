const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const configSchema = new Schema({
  customer: {
    canCreate: {
      type: Array,
    },
  },

  users: {
    usersCanBeDeleted: {
      type: Boolean,
      default: true,
    },
    managersCanBeDeleted: {
      type: Boolean,
      default: true,
    },
  },

  departments: {
    departmentsCanBeDeleted: {
      type: Boolean,
      default: true,
    },
  },

  requests: {
    requestsNeedApproval: {
      type: Boolean,
      default: true,
    },
    canBeDeleted: {
      type: Boolean,
      default: true,
    },
    canCreate: {
      type: Array,
    },
  },

  quotes: {
    canDelete: {
      type: Array,
    },
  },

  services: {
    canCreate: {
      type: Array,
    },
  },

  stock: {
    canCreate: {
      type: Array,
    },
  },

  finance: {
    canCreate: {
      type: Array,
    },
  },

  files: {
    canDelete: {
      type: Array,
    },
  },

  customization: {
    mainColor: {
      type: String,
      default: "#32aacd",
    },
    fontColor: {
      type: String,
      default: "white",
    },
    logo: {
      type: String,
      default: "/images/logo_text.png",
    },
  },

  security: {
    passwordComplexity: {
      type: String,
      default: "low",
    },
  },

  sidebar: {
    dashboard: {
      type: Array,
    },
    customers: {
      type: Array,
    },
    users: {
      type: Array,
    },
    departments: {
      type: Array,
    },
    requests: {
      type: Array,
    },
    quotes: {
      type: Array,
    },
    services: {
      type: Array,
    },
    stock: {
      type: Array,
    },
    finance: {
      type: Array,
    },
    files: {
      type: Array,
    },
    config: {
      type: Array,
    },
  },
});

const Config = mongoose.model("Config", configSchema);

module.exports = Config;

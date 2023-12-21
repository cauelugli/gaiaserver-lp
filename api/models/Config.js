const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const configSchema = new Schema({
  customer: {
    canSee: {
      type: Array,
    },
    canCreate: {
      type: Array,
    },
    canDelete: {
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
    canSee: {
      type: Array,
    },
    canCreate: {
      type: Array,
    },
    canDelete: {
      type: Array,
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
    canSee: {
      type: Array,
    },
    canCreate: {
      type: Array,
    },
    canDelete: {
      type: Array,
    },
  },

  services: {
    canSee: {
      type: Array,
    },
    canCreate: {
      type: Array,
    },
    canDelete: {
      type: Array,
    },
  },

  stock: {
    canSee: {
      type: Array,
    },
    canCreate: {
      type: Array,
    },
    canDelete: {
      type: Array,
    },
  },

  finance: {
    canSee: {
      type: Array,
    },
    canCreate: {
      type: Array,
    },
    canDelete: {
      type: Array,
    },
  },

  files: {
    canSee: {
      type: Array,
    },
    canCreate: {
      type: Array,
    },
    canDelete: {
      type: Array,
    },
  },

  customization: {
    mainColor: {
      type: String,
      default: '#32aacd',
    },
    fontColor: {
      type: String,
      default: 'white',
    },
    logo: {
      type: String,
      default: "default.png",
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

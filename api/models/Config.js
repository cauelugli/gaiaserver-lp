const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const configSchema = new Schema({
  customers: {
    customersCanBeDeleted: {
      type: Boolean,
      default: true,
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
    departmentsNeedManager: {
      type: Boolean,
      default: false,
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
    stockentriesDispatcherDepartment: {
      type: Object,
    },
    stockEntriesNeedApproval: {
      type: Boolean,
      default: true,
    },
    stockEntriesCanBeChallenged: {
      type: Boolean,
      default: true,
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

  notifications: {
    x: {
      type: Object,
    },
    y: {
      type: Object,
    },
    z: {
      type: Object,
    },
  },
});

const Config = mongoose.model("Config", configSchema);

module.exports = Config;

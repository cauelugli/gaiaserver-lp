const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const configSchema = new Schema({
  customers: {
    customersCanBeDeleted: {
      type: Boolean,
      default: true,
    },
    clientsCanBeDeleted: {
      type: Boolean,
      default: true,
    },
    allowSameNameCustomer: {
      type: Boolean,
      default: false,
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

  projects: {
    canBeDeleted: {
      type: Boolean,
      default: true,
    },
    projectTypes: {
      type: Array,
      default: ["Melhorias", "Expansão"],
    },
  },

  quotes: {
    canBeDeleted: {
      type: Boolean,
      default: false,
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

  reports: {
    canBeDeleted: {
      type: Boolean,
      default: true,
    },
  },

  finance: {
    canReceiveInstallments: {
      type: Boolean,
      default: true,
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
    logoBlack: {
      type: String,
      default: "",
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
    whenUserIsCreated: {
      type: Array,
    },
  },

  notificationsBooleans: {
    whenUserIsCreated: {
      type: Boolean,
      default: false,
    },
    whenProjectIsCreated: {
      type: Boolean,
      default: true,
    },
  },

  tables: {
    customerCustomer: {
      type: Boolean,
      default: true,
    },
    customerClient: {
      type: Boolean,
      default: true,
    },
    departmentInternal: {
      type: Boolean,
      default: true,
    },
    requestJob: {
      type: Boolean,
      default: true,
    },
    requestSale: {
      type: Boolean,
      default: true,
    },
    serviceConsulting: {
      type: Boolean,
      default: true,
    },
    servicePlan: {
      type: Boolean,
      default: true,
    },
    stockProduct: {
      type: Boolean,
      default: true,
    },
    stockItems: {
      type: Boolean,
      default: true,
    },
  },
});

const Config = mongoose.model("Config", configSchema);

module.exports = Config;

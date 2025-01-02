const { mongoose } = require("../db");
const Schema = mongoose.Schema;

const configSchema = new Schema({
  agenda: {
    minTime: {
      type: Number,
      default: 7,
    },
    maxTime: {
      type: Number,
      default: 22,
    },
    showServiceColorOnEvents: {
      type: Boolean,
      default: false,
    },
    eventTypes: {
      type: Array,
      default: [{ name: "Job", color: "#4a90e2" }],
    },
  },
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
  dashboard: {
    showAgenda: {
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
  permissions: {
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
    customization: {
      type: Array,
    },
    security: {
      type: Array,
    },
    reports: {
      type: Array,
    },
    products: {
      type: Array,
    },
  },
  products: {
    productsCanBeDeleted: {
      type: Boolean,
      default: true,
    },
  },
  quotes: {
    canBeDeleted: {
      type: Boolean,
      default: false,
    },
  },
  reports: {
    canBeDeleted: {
      type: Boolean,
      default: true,
    },
  },
  requests: {
    requestsNeedApproval: {
      type: Boolean,
      default: true,
    },
    requestsApproverManager: {
      type: String,
    },
    canBeDeleted: {
      type: Boolean,
      default: true,
    },
    canCreate: {
      type: Array,
    },
    requestStatuses: {
      type: Array,
      default: ["Aberto", "Aprovado", "Resolvido"],
    },
  },
  security: {
    passwordComplexity: {
      type: String,
      default: "low",
    },
  },
  services: {
    canBeDeleted: {
      type: Boolean,
      default: true,
    },
    serviceTypes: {
      type: Array,
      default: [],
    },
  },
  stock: {
    stockEntriesDispatcherManager: {
      type: String,
      default: "",
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
});

const Config = mongoose.model("Config", configSchema);

module.exports = Config;

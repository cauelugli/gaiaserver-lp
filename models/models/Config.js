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
  finance: {
    canReceiveInstallments: {
      type: Boolean,
      default: true,
    },
  },
  files: {},
  products: {},
  reports: {},
  requests: {
    requestStatuses: {
      type: Array,
      default: ["Aberto"],
    },
  },
  services: {
    serviceTypes: {
      type: Array,
      default: [],
    },
  },
  stock: {},
  tables: {
    customerCustomer: {
      type: Boolean,
      default: true,
    },
    customerClient: {
      type: Boolean,
      default: true,
    },
    groups: {
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
    servicePlan: {
      type: Boolean,
      default: true,
    },
  },
});

const Config = mongoose.model("Config", configSchema);

module.exports = Config;

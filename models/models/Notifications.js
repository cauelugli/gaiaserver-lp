const { mongoose } = require("../db");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  user: {
    userIsCreated: {
      type: Array,
      default: [],
    },
    userIsEdited: {
      type: Array,
      default: [],
    },
    userIsDeleted: {
      type: Array,
      default: [],
    },
  },
  customer: {
    customerIsCreated: {
      type: Array,
      default: [],
    },
    customerIsEdited: {
      type: Array,
      default: [],
    },
    customerIsDeleted: {
      type: Array,
      default: [],
    },
  },
  job: {
    jobIsCreated: {
      type: Array,
      default: [],
    },
    jobIsEdited: {
      type: Array,
      default: [],
    },
    jobIsDeleted: {
      type: Array,
      default: [],
    },
  },
  sale: {
    saleIsCreated: {
      type: Array,
      default: [],
    },
    saleIsEdited: {
      type: Array,
      default: [],
    },
    saleIsDeleted: {
      type: Array,
      default: [],
    },
  },
  product: {
    productIsCreated: {
      type: Array,
      default: [],
    },
    productIsEdited: {
      type: Array,
      default: [],
    },
    productIsDeleted: {
      type: Array,
      default: [],
    },
  },
  service: {
    serviceIsCreated: {
      type: Array,
      default: [],
    },
    serviceIsEdited: {
      type: Array,
      default: [],
    },
    serviceIsDeleted: {
      type: Array,
      default: [],
    },
  },
  serviceplan: {
    serviceplanIsCreated: {
      type: Array,
      default: [],
    },
    serviceplanIsEdited: {
      type: Array,
      default: [],
    },
    serviceplanIsDeleted: {
      type: Array,
      default: [],
    },
  },
  stockentry: {
    stockentryIsCreated: {
      type: Array,
      default: [],
    },
    stockentryIsEdited: {
      type: Array,
      default: [],
    },
    stockentryIsDeleted: {
      type: Array,
      default: [],
    },
  },
});

const Notifications = mongoose.model("Notifications", notificationSchema);

module.exports = Notifications;

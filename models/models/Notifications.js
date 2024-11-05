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
  department: {
    departmentIsCreated: {
      type: Array,
      default: [],
    },
    departmentIsEdited: {
      type: Array,
      default: [],
    },
    departmentIsDeleted: {
      type: Array,
      default: [],
    },
  },
  group: {
    groupIsCreated: {
      type: Array,
      default: [],
    },
    groupIsEdited: {
      type: Array,
      default: [],
    },
    groupIsDeleted: {
      type: Array,
      default: [],
    },
  },
});

const Notifications = mongoose.model("Notifications", notificationSchema);

module.exports = Notifications;

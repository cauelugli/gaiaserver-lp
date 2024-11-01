const { mongoose } = require("../db");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  user: {
    undefinedserIsCreated: {
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
  requests: {
    jobIsCreated: {
      type: Array,
      default: [],
    },
    saleIsCreated: {
      type: Array,
      default: [],
    },
  },
});

const Notifications = mongoose.model("Notifications", notificationSchema);

module.exports = Notifications;

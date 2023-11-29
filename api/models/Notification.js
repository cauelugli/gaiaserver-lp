const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  itemId: {
    type: String,
    required: true,
  },
  sender: {
    type: Object,
    required: true,
  },
  receiver: {
    type: Object,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "Não Lida",
  },
  sentDate: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;

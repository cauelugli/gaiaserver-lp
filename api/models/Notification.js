const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  noteBody: {
    type: String,
  },
  sender: {
    type: Object,
  },
  receiver: {
    type: Object,
  },
  status: {
    type: String,
    default: "Não Lida",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;

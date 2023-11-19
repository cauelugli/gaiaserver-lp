const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose.connection);

saleSchema = new mongoose.Schema({
  customer: {
    type: Object,
    required: true,
  },
  requester: {
    type: String,
    required: true,
  },
  seller: {
    type: Object,
    required: true,
  },
  manager: {
    type: Object,
    required: true,
  },
  department: {
    type: Object,
    required: true,
  },
  status: {
    type: String,
  },
  price: {
    type: Number,
    default: 0,
    required: true,
  },
  items: {
    type: Object,
  },
  interactions: [
    {
      number: Number,
      activity: String,
      user: String,
      date: String,
      reactions: {
        love: { quantity: Number, usersReacted: [] },
        like: { quantity: Number, usersReacted: [] },
        dislike: { quantity: Number, usersReacted: [] },
        haha: { quantity: Number, usersReacted: [] },
      },
    },
  ],
  deliveryScheduledTo: {
    type: String,
    required: true,
  },
  deliveryAddress: {
    type: String,
    required: true,
  },
  deliveryReceiver: {
    type: String,
  },
  deliveryReceiverPhone: {
    type: String,
  },
  deliveredIn: {
    type: String,
  },
  createdBy: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

saleSchema.plugin(autoIncrement.plugin, {
  model: "Job",
  field: "quoteNumber",
  startAt: 1,
  incrementBy: 1,
});

const Sale = mongoose.model("Sale", saleSchema);

module.exports = Sale;

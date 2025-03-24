const { mongoose } = require("../db");

saleSchema = new mongoose.Schema({
  attachments: {
    type: Array,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
  },
  customer: {
    type: Object,
    required: true,
  },
  commentary: {
    type: String,
  },
  deliveredIn: {
    type: String,
  },
  deliveryAddress: {
    type: String,
  },
  deliveryReceiver: {
    type: String,
  },
  deliveryReceiverPhone: {
    type: String,
  },
  deliveryScheduledTo: {
    type: String,
  },
  interactions: [
    {
      activity: String,
      attachments: Array,
      date: String,
      number: Number,
      reactions: {
        dislike: { quantity: Number, usersReacted: [] },
        haha: { quantity: Number, usersReacted: [] },
        like: { quantity: Number, usersReacted: [] },
        love: { quantity: Number, usersReacted: [] },
      },
      user: String,
    },
  ],
  manager: {
    type: String,
  },
  number: {
    type: Number,
  },
  price: {
    type: Number,
  },
  products: {
    type: Array,
  },
  requester: {
    type: String,
  },
  resolution: {
    type: String,
  },
  resolvedAt: {
    type: String,
  },
  resolvedBy: {
    type: String,
  },
  seller: {
    type: String,
  },
  status: {
    type: String,
  },
});

const Sale = mongoose.model("Sale", saleSchema);

module.exports = Sale;

const { mongoose } = require("../db");

jobSchema = new mongoose.Schema({
  attachments: {
    type: Array,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  customer: {
    type: String,
    required: true,
  },
  description: {
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
  products: {
    type: Array,
  },
  number: {
    type: Number,
  },
  price: {
    type: Number,
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
  scheduledInfo: {
    type: Object,
  },
  scheduledTo: {
    type: String,
  },
  scheduleTime: {
    type: String,
  },
  service: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "Aberto"
  },
  title: {
    type: String,
    required: true,
  },
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;

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
  createdBy: {
    type: String,
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
  resolvedBy: {
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
  },
  title: {
    type: String,
    required: true,
  },
  worker: {
    type: String,
  },
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;

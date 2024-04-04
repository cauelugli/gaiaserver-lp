const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose.connection);

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
    type: Object,
    required: true,
  },
  department: {
    type: Object,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  interactions: [
    {
      activity: String,
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
  local: {
    type: String,
  },
  manager: {
    type: Object,
    required: true,
  },
  materials: {
    type: Array,
  },
  materialsCost: {
    type: Number,
  },
  price: {
    type: Number,
    required: true,
  },
  requester: {
    type: String,
    required: true,
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
  scheduledTo: {
    type: Date,
    required: true,
  },
  selectedSchedule: {
    type: String,
  },
  service: {
    type: Object,
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
    type: Object,
    required: true,
  },
});

jobSchema.plugin(autoIncrement.plugin, {
  field: "quoteNumber",
  incrementBy: 1,
  model: "Job",
  startAt: 1,
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;

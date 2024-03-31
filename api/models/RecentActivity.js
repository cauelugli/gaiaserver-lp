const mongoose = require("mongoose");

const recentActivitySchema = new mongoose.Schema({
  activity: {
    type: String,
  },
  createdAt: {
    type: String,
  },
});

const RecentActivity = mongoose.model("RecentActivity", recentActivitySchema);

module.exports = RecentActivity;

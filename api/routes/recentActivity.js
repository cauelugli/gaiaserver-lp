const express = require("express");
const router = express.Router();
const RecentActivity = require("../models/RecentActivity");

// GET RECENT ACTIVITIES
router.get("/", async (req, res) => {
  try {
    const recentActivities = await RecentActivity.find();
    res.status(200).json(recentActivities);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE RECENT ACTIVITY
router.post("/", async (req, res) => {
  const newActivity = new RecentActivity(req.body);
  try {
    const savedActivity = await newActivity.save();
    console.log()
    res.status(200).json(savedActivity);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;

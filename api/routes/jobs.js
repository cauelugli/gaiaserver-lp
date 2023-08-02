const express = require("express");
const router = express.Router();
const Job = require("../models/Job");

// GET ALL JOBS
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE JOB
router.post("/", async (req, res) => {
  const newJob = new Job(req.body);
  try {
    const savedJob = await newJob.save();
    res.status(200).json(savedJob);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// DELETE JOB
router.delete("/:id", async (req, res) => {
  const jobId = req.params.id;
  try {
    const deletedJob = await Job.findByIdAndDelete(jobId);
    res.status(200).json(deletedJob);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
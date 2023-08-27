const express = require("express");
const router = express.Router();
const Job = require("../models/Job");

// GET ALL REQUESTS
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find();
    console.log('jobs', jobs)
    jobs.filter((job) => job.type === "Job")
    res.status(200).json(jobs);
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

// CREATE REQUEST
router.post("/", async (req, res) => {
  const newRequest = new Job(req.body);
  try {
    const savedRequest = await newRequest.save();
    res.status(200).json(savedRequest);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// DELETE REQUEST
router.delete("/:id", async (req, res) => {
  const requestId = req.params.id;
  try {
    const deletedRequest = await Job.findByIdAndDelete(requestId);
    res.status(200).json(deletedRequest);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
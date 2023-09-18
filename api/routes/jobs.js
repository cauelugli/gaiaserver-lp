const express = require("express");
const router = express.Router();
const Job = require("../models/Job");

// GET ALL JOBS
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

// CREATE JOB
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

// DELETE JOB
router.delete("/:id", async (req, res) => {
  const requestId = req.params.id;
  try {
    const deletedRequest = await Job.findByIdAndDelete(requestId);
    res.status(200).json(deletedRequest);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE JOB
router.put("/", async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(
      req.body.jobId,
      {
        title: req.body.title,
        description: req.body.description,
        requester: req.body.requester,
        department: req.body.department,
        worker: req.body.worker,
        manager: req.body.manager,
        service: req.body.service,
        price: req.body.price,
        local: req.body.local,
        scheduledTo: req.body.scheduledTo,
      },
      { new: true }
    );
    res.status(200).json(updatedJob);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
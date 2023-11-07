const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const StockItem = require("../models/StockItem");

// GET ALL JOBS
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// CREATE JOB
router.post("/", async (req, res) => {
  const newRequest = new Job(req.body);
  if (newRequest.materials.length > 0) {
    for (const material of newRequest.materials) {
      const stockItem = await StockItem.findById(material._id);
      stockItem.quantity -= material.quantity;
      await stockItem.save();
    }
  }
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
    const jobId = req.body.jobId;
    const option = req.body.option;
    const status = req.body.status;

    if (option === "interaction") {
      const updatedJob = await Job.findOneAndUpdate(
        { _id: jobId },
        {
          $set: {
            status: status,
          },
          $push: {
            interactions: {
              number: req.body.number || 1,
              activity: req.body.activity,
              user: req.body.user,
              date: req.body.date,
            },
          },
        },
        { new: true }
      );
      res.status(200).json(updatedJob);
    } else if (option === "edit") {
      const updatedJob = await Job.findByIdAndUpdate(
        jobId,
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
    } else {
      res.status(400).json({ error: "Opção inválida" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

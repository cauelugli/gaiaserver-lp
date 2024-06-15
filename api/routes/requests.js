const express = require("express");
const router = express.Router();
const Job = require("../../models/models/Job");
const Sale = require("../../models/models/Sale");

// CHANGE REQUEST STATUS
router.put("/changeStatus", async (req, res) => {
  try {
    const jobId = req.body.itemId;
    // const itemToUpdate = await Job.findById(jobId);

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      {
        status: req.body.newStatus,
      },
      { new: true }
    );

    res.status(200).json(updatedJob);
  } catch (err) {
    console.log("err", err);
    res.status(500).json(err);
  }
});

module.exports = router;

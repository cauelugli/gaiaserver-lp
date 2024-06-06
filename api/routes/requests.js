const express = require("express");
const router = express.Router();
const Job = require("../../models/models/Job");
const Sale = require("../../models/models/Sale");

// CHANGE REQUEST STATUS
router.put("/changeStatus", async (req, res) => {
  try {
    console.log("req.body", req.body);
    // const jobId = req.body.jobId || req.body.job._id;
    // const jobToUpdate = await Job.findById(jobId);

    // const updatedJob = await Job.findByIdAndUpdate(
    //   jobId,
    //   {
    //     title: req.body.title,
    //     customer: req.body.customer,
    //     customerType: req.body.customerType,
    //     description: req.body.description,
    //     requester: req.body.requester,
    //     department: req.body.department,
    //     worker: req.body.worker,
    //     manager: req.body.manager,
    //     service: req.body.service,
    //     price: req.body.price,
    //     local: req.body.local,
    //     scheduledTo: req.body.scheduledTo,
    //     number: jobToUpdate.number,
    //   },
    //   { new: true }
    // );

    const updatedJob = {};
    res.status(200).json(updatedJob);
  } catch (err) {
    console.log("err", err);
    res.status(500).json(err);
  }
});

module.exports = router;

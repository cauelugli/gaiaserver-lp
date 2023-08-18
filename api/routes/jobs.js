const express = require("express");
const router = express.Router();
const Request = require("../models/Request");

// GET ALL REQUESTS
router.get("/", async (req, res) => {
  try {
    const requests = await Request.find();
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE REQUEST
router.post("/", async (req, res) => {
  const newRequest = new Request(req.body);
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
    const deletedRequest = await Request.findByIdAndDelete(requestId);
    res.status(200).json(deletedRequest);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
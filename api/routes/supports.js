const express = require("express");
const router = express.Router();
const Support = require("../models/Support");

// GET ALL REQUESTS
router.get("/", async (req, res) => {
  try {
    const supports = await Support.find();
    res.status(200).json(supports);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE REQUEST
router.post("/", async (req, res) => {
  const newRequest = new Support(req.body);
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
    const deletedRequest = await Support.findByIdAndDelete(requestId);
    res.status(200).json(deletedRequest);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const Log = require("../../models/models/Log");

// CREATE LOG
router.post("/", async (req, res) => {
  try {
    new Log({
      source: req.body.source,
      target: req.body.target,
      label: req.body.label,
    }).save();

    res.status(200).json("OK");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;

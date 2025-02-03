const express = require("express");
const router = express.Router();
const Log = require("../../models/models/Log");
const { translateLogType } = require("../../controllers/notificationOptions");

// CREATE LOG
router.post("/", async (req, res) => {
  //switch case ahead
  try {
    new Log({
      source: req.body.source,
      target: req.body.target,
      label: req.body.label,
      type: translateLogType(req.body.type),
    }).save();

    res.status(200).json("OK");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;

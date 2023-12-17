const express = require("express");
const router = express.Router();
const Config = require("../models/Config");

//GET ALL CONFIGS
router.get("/", async (req, res) => {
  try {
    const configs = await Config.find();
    res.status(200).json(configs);
  } catch (err) {
    res.status(500).json(err);
  }
});

// REQUEST - REQUEST NEEDS APPROVAL
router.put("/requests/requestsNeedApproval", async (req, res) => {
  try {
    const { requestNeedsApproval } = req.body;
    const config = await Config.findOne();
    config.requests.requestNeedsApproval = requestNeedsApproval;
    await config.save();
    res.status(200).json(config);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

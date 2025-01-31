const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Admin = require("../../models/models/Admin");
const UserPreferences = require("../../models/models/UserPreferences");

// CREATE LOG
router.post("/", async (req, res) => {
  console.log("req.body", req.body);
  try {
    res.status(200).json("OK");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;

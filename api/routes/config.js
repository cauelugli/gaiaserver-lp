const express = require("express");
const router = express.Router();
const Config = require("../models/Config");

// CREATE INITIAL CONFIG
router.post("/", async (req, res) => {
  const newConfig = new Config();
  try {
    const createdConfig = await newConfig.save();
    res.status(200).json(createdConfig);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//GET ALL CONFIGS
router.get("/", async (req, res) => {
  try {
    const configs = await Config.find();
    res.status(200).json(configs);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET USERS CONFIGS
router.get("/users", async (req, res) => {
  try {
    const config = await Config.findOne();
    const requestsConfig = config ? config.users : null;
    res.status(200).json(requestsConfig);
  } catch (err) {
    res.status(500).json(err);
  }
});

// USERS
router.put("/users", async (req, res) => {
  try {
    const { usersCanBeDeleted, managersCanBeDeleted } = req.body;

    const config = await Config.findOne();

    config.users.usersCanBeDeleted = usersCanBeDeleted;
    config.users.managersCanBeDeleted = managersCanBeDeleted;

    await config.save();
    res.status(200).json(config);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET REQUESTS CONFIGS
router.get("/requests", async (req, res) => {
  try {
    const config = await Config.findOne();
    const requestsConfig = config ? config.requests : null;
    res.status(200).json(requestsConfig);
  } catch (err) {
    res.status(500).json(err);
  }
});

// REQUESTS
router.put("/requests", async (req, res) => {
  try {
    const { requestsNeedApproval, requestsCanBeDeleted } = req.body;

    const config = await Config.findOne();

    config.requests.requestsNeedApproval = requestsNeedApproval;
    config.requests.canBeDeleted = requestsCanBeDeleted;

    await config.save();
    res.status(200).json(config);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// CUSTOMIZATION
router.put("/customization", async (req, res) => {
  try {
    const { mainColor, fontColor, logo } = req.body;

    const config = await Config.findOne();

    config.customization.mainColor = mainColor;
    config.customization.fontColor = fontColor;
    config.customization.logo = logo;

    await config.save();
    res.status(200).json(config);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET SECURITY CONFIGS
router.get("/security", async (req, res) => {
  try {
    const config = await Config.findOne();
    const requestsConfig = config ? config.security : null;
    res.status(200).json(requestsConfig);
  } catch (err) {
    res.status(500).json(err);
  }
});

// SECURITY
router.put("/security", async (req, res) => {
  try {
    const { passwordComplexity } = req.body;

    const config = await Config.findOne();

    config.security.passwordComplexity = passwordComplexity;

    await config.save();
    res.status(200).json(config);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

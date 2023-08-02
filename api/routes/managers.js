const express = require("express");
const router = express.Router();
const Manager = require("../models/Manager");

// GET ALL MANAGERS
router.get("/", async (req, res) => {
  try {
    const managers = await Manager.find();
    res.status(200).json(managers);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE MANAGER
router.post("/", async (req, res) => {
  const newManager = new Manager(req.body);
  try {
    const savedManager = await newManager.save();
    res.status(200).json(savedManager);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// DELETE MANAGER
router.delete("/:id", async (req, res) => {
  const managerId = req.params.id;
  try {
    const deletedManager = await Manager.findByIdAndDelete(managerId);
    res.status(200).json(deletedManager);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE MANAGER
router.put("/", async (req, res) => {
  try {
    const updatedManager = await Manager.findByIdAndUpdate(
      req.body.managerId,
      {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        avatar: req.body.avatar,
        avatarColor: req.body.avatarColor,
        isActive: req.body.isActive,
      },
      { new: true }
    );
    res.status(200).json(updatedManager);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
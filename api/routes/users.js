const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Department = require("../models/Department");

// GET ALL USERS
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE USER
router.post("/", async (req, res) => {
  const newUser = new User(req.body);
  try {
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// DELETE USER
router.delete("/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    const updatedSubordinates = await User.updateMany(
      { "manager.id": userId },
      {
        "manager.id": "N/A",
        "manager.name": "N/A",
      }
    );
    // UPDATE DEPARTMENT MANAGER (if the call is a manager position change)
    const updatedManager = await Department.updateMany(
      { "manager.id": userId },
      {
        "manager.id": "N/A",
        "manager.name": "N/A",
      }
    );
    res.status(200).json({ deletedUser, updatedSubordinates });
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE USER
router.put("/", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.body.userId,
      {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        position: req.body.position,
        department: req.body.department,
        manager: req.body.manager,
        avatar: req.body.avatar,
        avatarColor: req.body.avatarColor,
        isActive: req.body.isActive,
      },
      { new: true }
    );
    // UPDATE SUBORDINATE USERS (if the call is a manager position change)
    const updatedSubordinates = await User.updateMany(
      { "manager.id": req.body.userId },
      {
        $set: {
          "manager.id": req.body.userId,
          "manager.name": req.body.name,
        },
      }
    );
    // UPDATE DEPARTMENT MANAGER (if the call is a manager position change)
    const updatedManager = await Department.updateMany(
      { "manager.id": req.body.userId },
      {
        $set: {
          "manager.id": req.body.userId,
          "manager.name": req.body.name,
        },
      }
    );
    res.status(200).json({ updatedUser, updatedSubordinates });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

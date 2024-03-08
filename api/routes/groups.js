const express = require("express");
const router = express.Router();
const Group = require("../models/Group");

// GET GROUPS
router.get("/", async (req, res) => {
  try {
    const groups = await Group.find();
    res.status(200).json(groups);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE GROUP
router.post("/", async (req, res) => {
  const newGroup = new Group(req.body);
  try {
    const savedGroup = await newGroup.save();
    res.status(200).json(savedGroup);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// DELETE GROUP
router.delete("/:id", async (req, res) => {
  const groupId = req.params.id;
  try {
    const deletedGroup = await Group.findByIdAndDelete(groupId);
    res.status(200).json(deletedGroup);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE GROUP
router.put("/", async (req, res) => {
  try {
    const updatedGroup = await Group.findByIdAndUpdate(
      req.body.groupId,
      {
        name: req.body.name,
        members: req.body.members,
      },
      { new: true }
    );
    res.status(200).json(updatedGroup);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

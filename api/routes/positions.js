const express = require("express");
const router = express.Router();
const Position = require("../models/Position");
const User = require("../models/User");

// GET ALL POSITIONS
router.get("/", async (req, res) => {
  try {
    const positions = await Position.find();
    res.status(200).json(positions);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE POSITION
router.post("/", async (req, res) => {
  const { name } = req.body;
  const existingName = await Position.findOne({ name });
  if (existingName) {
    return res.status(422).json({ error: "Nome de Cargo já cadastrado" });
  }
  const newPosition = new Position(req.body);
  try {
    const savedPosition = await newPosition.save();
    res.status(200).json(savedPosition);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// DELETE POSITION
router.delete("/:id", async (req, res) => {
  const positionId = req.params.id;
  try {
    const deletedPosition = await Position.findByIdAndDelete(positionId);
    const usersToUpdate = await User.find({ "position._id": positionId });
    for (const user of usersToUpdate) {
      user.position = {};
      await user.save();
    }

    res.status(200).json(deletedPosition);
  } catch (err) {
    console.log("error", err);
    res.status(500).json(err);
  }
});

// UPDATE POSITION
router.put("/", async (req, res) => {
  const { name, positionId } = req.body;
  const existingName = await Position.findOne({ name: name });

  if (existingName && existingName.name !== req.body.previousData.name) {
    return res.status(422).json({ error: "Nome de Cargo já cadastrado" });
  }

  try {
    const updatedPosition = await Position.findByIdAndUpdate(
      positionId,
      { name: name },
      { new: true }
    );

    const usersToUpdate = await User.find({ "position._id": positionId });

    for (const user of usersToUpdate) {
      await User.findByIdAndUpdate(
        user._id,
        { $set: { "position.name": updatedPosition.name } },
        { new: true }
      );
    }

    res.status(200).json(updatedPosition);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;

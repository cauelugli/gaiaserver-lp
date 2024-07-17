const express = require("express");
const router = express.Router();
const Position = require("../../models/models/Position");
const User = require("../../models/models/User");
const Department = require("../../models/models/Department");

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
  const { name, department } = req.body;
  let updatedDepartment;

  const existingName = await Position.findOne({ name });
  if (existingName) {
    return res.status(422).json({ error: "Nome de Cargo já cadastrado" });
  }

  const newPosition = new Position(req.body);

  try {
    const savedPosition = await newPosition.save();

    updatedDepartment = await Department.findByIdAndUpdate(
      department._id,
      {
        $push: {
          positions: {
            _id: savedPosition._id.toString(),
            name: name,
          },
        },
      },
      { new: true }
    );

    res.status(200).json({ savedPosition, updatedDepartment });
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

    const updatedDepartment = await Department.findOneAndUpdate(
      { "positions._id": positionId },
      {
        $pull: { positions: { _id: positionId } },
        $set: { "members.$[elem].position": {} },
      },
      {
        new: true,
        arrayFilters: [{ "elem.position._id": positionId }],
      }
    );

    res.status(200).json({ deletedPosition, updatedDepartment });
  } catch (err) {
    console.log("error", err);
    res.status(500).json(err);
  }
});

// UPDATE POSITION
router.put("/", async (req, res) => {
  const { name, department, positionId, previousData } = req.body;
  const existingName = await Position.findOne({ name: name });

  if (existingName && existingName.name !== req.body.previousData.name) {
    return res.status(422).json({ error: "Nome de Cargo já cadastrado" });
  }

  try {
    const updatedPosition = await Position.findByIdAndUpdate(
      positionId,
      { name: name, department: department },
      { new: true }
    );

    if (previousData.department._id !== department._id) {
      await Department.findByIdAndUpdate(previousData.department._id, {
        $pull: {
          positions: { _id: positionId },
          members: { "position._id": positionId },
        },
      });

      const newDepartment = await Department.findByIdAndUpdate(
        department._id,
        {
          $push: {
            positions: { _id: updatedPosition._id.toString(), name: name },
          },
        },
        { new: true }
      );

      for (const member of newDepartment.members) {
        if (member.position._id === positionId) {
          await Department.updateOne(
            { _id: department._id, "members._id": member._id },
            {
              $set: {
                "members.$.position": {
                  _id: updatedPosition._id.toString(),
                  name: name,
                },
              },
            }
          );
        }
      }
    } else {
      await Department.updateOne(
        { _id: department._id, "positions._id": positionId },
        {
          $set: {
            "positions.$.name": name,
            "members.$[elem].position.name": name,
          },
        },
        { arrayFilters: [{ "elem.position._id": positionId }] }
      );
    }

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

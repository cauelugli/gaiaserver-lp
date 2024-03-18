const express = require("express");
const router = express.Router();
const Group = require("../models/Group");
const User = require("../models/User");
const Manager = require("../models/Manager");

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
  let updatedMembers = [];
  try {
    const savedGroup = await newGroup.save();

    for (const member of req.body.members) {
      let type;
      if ("position" in member) {
        type = User;
      } else {
        type = Manager;
      }

      const updatedMember = await type.updateOne(
        { _id: member._id },
        {
          $push: {
            groups: {
              id: savedGroup._id.toString(),
              name: savedGroup.name,
            },
          },
        }
      );
      updatedMembers.push(updatedMember);
    }

    res.status(200).json({ savedGroup, updatedMembers });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// DELETE GROUP
router.delete("/:id", async (req, res) => {
  const groupId = req.params.id;
  let updatedMembers = [];
  try {
    const deletedGroup = await Group.findByIdAndDelete(groupId);
    for (const member of deletedGroup.members) {
      let type;
      if ("position" in member) {
        type = User;
      } else {
        type = Manager;
      }

      const updatedMember = await type.updateOne(
        { _id: member._id },
        {
          $pull: {
            groups: {
              id: groupId,
            },
          },
        }
      );
      updatedMembers.push(updatedMember);
    }

    res.status(200).json({ deletedGroup, updatedMembers });
  } catch (err) {
    console.log("err", err);
    res.status(500).json(err);
  }
});

// UPDATE RENAME GROUP
router.put("/rename", async (req, res) => {
  try {
    let updatedMembers = [];
    const updatedGroup = await Group.findByIdAndUpdate(
      req.body.groupId,
      {
        name: req.body.name,
      },
      { new: true }
    );

    for (const member of updatedGroup.members) {
      let type;
      if ("position" in member) {
        type = User;
      } else {
        type = Manager;
      }

      const updatedMember = await type.updateOne(
        { _id: member._id, "groups.id": req.body.groupId },
        { $set: { "groups.$.name": req.body.name } }
      );
      updatedMembers.push(updatedMember);
    }

    res.status(200).json({ updatedGroup, updatedMembers });
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE GROUP MEMBERS
router.put("/editMembers", async (req, res) => {
  try {
    const updatedGroup = await Group.findByIdAndUpdate(
      req.body.groupId,
      {
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

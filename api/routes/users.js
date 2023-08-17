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
    {req.body.department.name !== "" && 
    await Department.findOneAndUpdate(
      { name: req.body.department.name },
      {
        $addToSet: {
          members: {
            id: savedUser._id.toString(),
            name: savedUser.name,
            avatarColor: savedUser.avatarColor,
          },
        },
      },
      { upsert: true }
    )};
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
    const updatedDepartment = await Department.findOneAndUpdate(
      { "members.id": userId },
      { $pull: { members: { id: userId } } },
      { new: true }
    );

    res.status(200).json({ deletedUser, updatedDepartment });
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
        avatarColor: req.body.avatarColor,
        isActive: req.body.isActive,
      },
      { new: true }
    );

    if (req.body.position === "Gerente") {
      await Department.findOneAndUpdate(
        { name: req.body.department.name },
        {
          $set: {
            manager: {
              id: req.body.userId,
              name: req.body.name,
              avatarColor: req.body.avatarColor,
            },
          },
        },
        { upsert: true }
      );
    } else {
      ("");
    }

    if (req.body.department.name !== req.body.previousData.department.name) {
      await Department.findOneAndUpdate(
        { "members.id": req.body.userId },
        { $pull: { members: { id: req.body.userId } } }
      );

      await Department.findOneAndUpdate(
        { name: req.body.department.name },
        {
          $addToSet: {
            members: {
              id: req.body.userId,
              name: req.body.name,
              avatarColor: req.body.avatarColor,
            },
          },
        },
        { upsert: true }
      );
    } else {
      await Department.findOneAndUpdate(
        { "members.id": req.body.userId },
        {
          $set: {
            "members.$.id": req.body.userId,
            "members.$.name": req.body.name,
            "members.$.color": req.body.avatarColor,
          },
        }
      );
    }

    const updatedDepartment = await Department.findOneAndUpdate(
      { "members.id": req.body.userId },
      {
        $set: {
          "members.$.id": req.body.userId,
          "members.$.name": req.body.name,
          "members.$.color": req.body.avatarColor,
        },
      },
      { new: true }
    );

    res.status(200).json({ updatedUser, updatedDepartment });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;

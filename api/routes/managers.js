const express = require("express");
const router = express.Router();
const Manager = require("../models/Manager");
const Department = require("../models/Department");

// GET ALL MANAGERS
router.get("/", async (req, res) => {
  try {
    const users = await Manager.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE MANAGER
router.post("/", async (req, res) => {
  const newManager = new Manager(req.body);
  try {
    const savedManager = await newManager.save();
    // {req.body.department.name !== "" && 
    // await Department.findOneAndUpdate(
    //   { name: req.body.department.name },
    //   {
    //     $addToSet: {
    //       members: {
    //         id: savedUser._id.toString(),
    //         name: savedUser.name,
    //         avatarColor: savedUser.avatarColor,
    //       },
    //     },
    //   },
    //   { upsert: true }
    // )};
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
    // const updatedDepartment = await Department.findOneAndUpdate(
    //   { "members.id": userId },
    //   { $pull: { members: { id: userId } } },
    //   { new: true }
    // );

    // res.status(200).json({ deletedUser, updatedDepartment });
    res.status(200).json(deletedManager);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE Manager
router.put("/", async (req, res) => {
  try {
    const updatedManager = await Manager.findByIdAndUpdate(
      req.body.managerId,
      {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        department: req.body.department,
        avatarColor: req.body.avatarColor,
        isActive: req.body.isActive,
      },
      { new: true }
    );

     const updatedDepartment = await Department.findOneAndUpdate(
        { name: req.body.department.name },
        {
          $set: {
            manager: {
              id: req.body.managerId,
              name: req.body.name,
              email: req.body.email,
              phone: req.body.phone,
              avatarColor: req.body.avatarColor,
            },
          },
        },
        { upsert: true }
      );

    // if (req.body.department.name !== req.body.previousData.department.name) {
    //   await Department.findOneAndUpdate(
    //     { "members.id": req.body.userId },
    //     { $pull: { members: { id: req.body.userId } } }
    //   );

    //   await Department.findOneAndUpdate(
    //     { name: req.body.department.name },
    //     {
    //       $addToSet: {
    //         members: {
    //           id: req.body.userId,
    //           name: req.body.name,
    //           avatarColor: req.body.avatarColor,
    //         },
    //       },
    //     },
    //     { upsert: true }
    //   );
    // } else {
    //   await Department.findOneAndUpdate(
    //     { "members.id": req.body.userId },
    //     {
    //       $set: {
    //         "members.$.id": req.body.userId,
    //         "members.$.name": req.body.name,
    //         "members.$.color": req.body.avatarColor,
    //       },
    //     }
    //   );
    // }

    res.status(200).json({ updatedManager, updatedDepartment });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const Department = require("../models/Department");
const User = require("../models/User");
const Manager = require("../models/Manager");

// GET ALL DEPARTMENT
router.get("/", async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).json(departments);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE DEPARTMENT
router.post("/", async (req, res) => {
  let savedDepartment;
  let updatedManager;
  let updatedMembers = [];

  // CREATES A NEW MANAGER, IF SELECTED IN FRONTEND
  // MUST DO IT FIRST BECAUSE WE NEED THE MANAGER._ID PROP
  // WHICH CAN ONLY BE ACHIEVED BY CREATING THE MANAGER ON DB
  if (req.body.newManagerData.name !== "") {
    const newManager = new Manager({
      name: req.body.newManagerData.name,
      email: req.body.newManagerData.email,
      phone: req.body.newManagerData.phone,
      avatarColor: req.body.newManagerData.avatarColor,
    });
    const newDepartment = new Department({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      color: req.body.color,
      members: req.body.members,
      manager: newManager,
    });
    try {
      updatedManager = await newManager.save();
      savedDepartment = await newDepartment.save();

      // UPDATING MEMBERS
      const memberIds = req.body.members.map((member) => member.id);

      for (const memberId of memberIds) {
        const updatedMember = await User.updateOne(
          { _id: memberId },
          {
            $set: {
              "department.id": savedDepartment._id,
              "department.name": savedDepartment.name,
              "department.phone": savedDepartment.phone,
              "department.email": savedDepartment.email,
              "department.color": savedDepartment.color,
            },
          }
        );
        updatedMembers.push(updatedMember);
      }

      // UPDATING MANAGER, IF SELECTED
      updatedManager = await Manager.findOneAndUpdate(
        { _id: savedDepartment.manager._id },
        {
          $set: {
            "department.id": savedDepartment._id,
            "department.name": savedDepartment.name,
            "department.phone": savedDepartment.phone,
            "department.email": savedDepartment.email,
            "department.color": savedDepartment.color,
          },
        }
      );
      res.status(200).json({ savedDepartment, updatedMembers, updatedManager });
    } catch (err) {
      console.log(err);
    }
  } else if (req.body.manager.name !== "") {
    const newDepartment = new Department({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      color: req.body.color,
      members: req.body.members,
      manager: req.body.manager,
    });
    try {
      savedDepartment = await newDepartment.save();

      // UPDATING MEMBERS
      const memberIds = req.body.members.map((member) => member.id);

      for (const memberId of memberIds) {
        const updatedMember = await User.updateOne(
          { _id: memberId },
          {
            $set: {
              "department.id": savedDepartment._id,
              "department.name": savedDepartment.name,
              "department.phone": savedDepartment.phone,
              "department.email": savedDepartment.email,
              "department.color": savedDepartment.color,
            },
          }
        );
        updatedMembers.push(updatedMember);
      }

      // UPDATING MANAGER, IF SELECTED
      updatedManager = await Manager.findOneAndUpdate(
        { _id: req.body.manager._id },
        {
          $set: {
            "department.id": savedDepartment._id,
            "department.name": savedDepartment.name,
            "department.phone": savedDepartment.phone,
            "department.email": savedDepartment.email,
            "department.color": savedDepartment.color,
          },
        }
      );
      res.status(200).json({ savedDepartment, updatedMembers, updatedManager });
    } catch (err) {
      console.log(err);
    }
  } else {
    const newDepartment = new Department({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      color: req.body.color,
      members: req.body.members,
      manager: req.body.manager,
    });
    const memberIds = req.body.members.map((member) => member.id);

    for (const memberId of memberIds) {
      const updatedMember = await User.updateOne(
        { _id: memberId },
        {
          $set: {
            "department.id": savedDepartment._id,
            "department.name": savedDepartment.name,
            "department.phone": savedDepartment.phone,
            "department.email": savedDepartment.email,
            "department.color": savedDepartment.color,
          },
        }
      );
      updatedMembers.push(updatedMember);
    }
    try {
      savedDepartment = await newDepartment.save();
      res.status(200).json({ savedDepartment, updatedMembers });
    } catch (err) {
      console.log(err);
    }
  }
});

// DELETE DEPARTMENT
router.delete("/:id", async (req, res) => {
  const departmentId = req.params.id;

  try {
    const deletedDepartment = await Department.findByIdAndDelete(departmentId);
    const updatedMembers = [];
    for (const member of deletedDepartment.members) {
      const updatedMember = await User.updateOne(
        { _id: member.id },
        {
          department: {},
        }
      );
      updatedMembers.push(updatedMember);
    }
    const updatedManager = await Manager.findByIdAndUpdate(
      deletedDepartment.manager._id || deletedDepartment.manager.id,
      {
        department: {},
      }
    );
    res.status(200).json({
      deletedDepartment,
      updatedMembers,
      updatedManager,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// UPDATE DEPARTMENT
router.put("/", async (req, res) => {
  console.log("\nreq.body.manager", req.body.manager, "\n");
  console.log("\nreq.body.previousManager", req.body.previousManager, "\n");
  try {
    const updatedDepartment = await Department.findByIdAndUpdate(
      req.body.departmentId,
      {
        name: req.body.name,
        email: req.body.email,
        description: req.body.description,
        phone: req.body.phone,
        manager: req.body.manager,
        members: req.body.members,
        color: req.body.color,
        // isActive: req.body.isActive,
      },
      { new: true }
    );

    console.log("\nupdatedDepartment", updatedDepartment, "\n");

    let updatedManager;
    let removedManager;

    updatedDepartment.manager
      ? updatedDepartment.manager && req.body.previousManager
        ? updatedDepartment.manager._id === req.body.previousManager._id
          ? (updatedManager = await Manager.findByIdAndUpdate(
              updatedDepartment.manager._id || updatedDepartment.manager.id,
              {
                department: {
                  id: updatedDepartment._id.toString(),
                  name: updatedDepartment.name,
                  email: updatedDepartment.email,
                  phone: updatedDepartment.phone,
                  color: updatedDepartment.color,
                  // isActive: updatedDepartment.isActive,
                },
              }
            ))
          : ((removedManager = await Manager.findByIdAndUpdate(
              req.body.previousManager.id,
              {
                $set: { department: {} },
              }
            )),
            (updatedManager = await Manager.findByIdAndUpdate(
              updatedDepartment.manager._id || updatedDepartment.manager.id,
              {
                department: {
                  id: updatedDepartment._id.toString(),
                  name: updatedDepartment.name,
                  email: updatedDepartment.email,
                  phone: updatedDepartment.phone,
                  color: updatedDepartment.color,
                  // isActive: updatedDepartment.isActive,
                },
              }
            )))
        : (updatedManager = await Manager.findByIdAndUpdate(
            updatedDepartment.manager._id || updatedDepartment.manager.id,
            {
              department: {
                id: updatedDepartment._id.toString(),
                name: updatedDepartment.name,
                email: updatedDepartment.email,
                phone: updatedDepartment.phone,
                color: updatedDepartment.color,
                // isActive: updatedDepartment.isActive,
              },
            }
          ))
      : "";

    res.status(200).json({ updatedDepartment, updatedManager, removedManager });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;

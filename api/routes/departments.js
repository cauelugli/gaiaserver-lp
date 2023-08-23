const express = require("express");
const router = express.Router();
const Department = require("../models/Department");
const User = require("../models/User");

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
  const newDepartment = new Department(req.body);
  const memberIds = req.body.members.map((member) => member.id);
  const updatedMembers = [];
  try {
    const savedDepartment = await newDepartment.save();
    for (const memberId of memberIds) {
      const updatedMember = await User.updateOne(
        { _id: memberId },
        {
          $set: {
            "department.id": savedDepartment._id,
            "department.name": savedDepartment.name,
            "department.description": savedDepartment.description,
            "department.phone": savedDepartment.phone,
            "department.email": savedDepartment.email,
            "department.color": savedDepartment.color,
          },
        }
      );
      updatedMembers.push(updatedMember);
    }
    const updatedManager = await User.findOneAndUpdate(
      { _id: req.body.manager._id },
      {
        $set: {
          "department.id": savedDepartment._id,
          "department.name": savedDepartment.name,
          "department.description": savedDepartment.description,
          "department.phone": savedDepartment.phone,
          "department.email": savedDepartment.email,
          "department.color": savedDepartment.color,
          "department.isAllocated": true,
        },
      }
    );
    res.status(200).json({ savedDepartment, updatedMembers, updatedManager });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
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
          $set: {
            "department.id": "-",
            "department.name": "-",
            "department.description": "-",
            "department.phone": "-",
            "department.email": "-",
            "department.color": "-",
          },
        }
      );
      updatedMembers.push(updatedMember);
    }
    const updatedManager = await User.updateOne(
      { _id: deletedDepartment.manager._id },
      {
        $set: {
          "department.id": "-",
          "department.name": "-",
          "department.description": "-",
          "department.phone": "-",
          "department.email": "-",
          "department.color": "-",
        },
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
        isActive: req.body.isActive,
      },
      { new: true }
    );

    res.status(200).json({
      updatedDepartment,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;

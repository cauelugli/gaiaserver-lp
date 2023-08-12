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
          "department.phone": savedDepartment.phone,
          "department.email": savedDepartment.email,
          "department.color": savedDepartment.color,
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
  console.log('departmentId', departmentId)
  try {
    const deletedDepartment = await Department.findByIdAndDelete(departmentId);
    console.log('deletedDepartment', deletedDepartment)
    const memberIds = deletedDepartment.members.map((member) => member.id);
    const updatedMembers = await Promise.all(
      memberIds.map(async (memberId) => {
        return await User.updateOne(
          { _id: memberId },
          {
            $set: {
              "department.id": "N/A",
              "department.name": "N/A",
              "department.phone": "N/A",
              "department.email": "N/A",
              "department.color": "N/A",
            },
          }
        );
      })
    );
    const updatedManager = await User.updateOne(
      { _id: deletedDepartment.manager._id },
      {
        $set: {
          "department.id": "N/A",
          "department.name": "N/A",
          "department.phone": "N/A",
          "department.email": "N/A",
          "department.color": "N/A",
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
  console.log('req.body', req.body)
  try {
    const updatedDepartment = await Department.findByIdAndUpdate(
      req.body.departmentId,
      {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        manager: req.body.manager,
        members: req.body.members,
        color: req.body.color,
        isActive: req.body.isActive,
      },
      { new: true }
    );
    // UPDATE MEMBER USERS
    const updatedMembers = await User.updateMany(
      { "department.id": req.body.departmentId },
      {
        $set: {
          "department.id": req.body.userId,
          "department.name": req.body.name,
          "department.email": req.body.email,
          "department.phone": req.body.phone,
        },
      }
    );
    res.status(200).json({updatedDepartment, updatedMembers});
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

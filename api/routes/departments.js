const express = require("express");
const router = express.Router();
const Department = require("../models/Department");

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
  try {
    const savedDepartment = await newDepartment.save();
    res.status(200).json(savedDepartment);
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
    res.status(200).json(deletedDepartment);
  } catch (err) {
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
        phone: req.body.phone,
        avatar: req.body.avatar,
        avatarColor: req.body.avatarColor,
        isActive: req.body.isActive,
      },
      { new: true }
    );
    res.status(200).json(updatedDepartment);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
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

    let updatedDepartment;

    // Adds the new manager to a department
    if (req.body.department !== "") {
      updatedDepartment = await Department.findByIdAndUpdate(
        req.body.department.id,
        {
          manager: {
            id: savedManager._id.toString(),
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            avatarColor: req.body.avatarColor,
          },
        },
        { new: true }
      );
    } else {
      updatedDepartment = "";
    }
    res.status(200).json({ savedManager, updatedDepartment });
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
    const updatedDepartment = await Department.findByIdAndUpdate(
      deletedManager.department.id,
      { $set: { manager: "" } },
      { new: true }
    );
    res.status(200).json({ deletedManager, updatedDepartment });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// UPDATE MANAGER
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
      },
      { new: true }
    );

    let updatedDepartment;

    if (req.body.department !== "") {
      // Updates department's manager
      updatedDepartment = await Department.findByIdAndUpdate(
        req.body.department.id,
        {
          manager: {
            id: req.body.managerId,
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            avatarColor: req.body.avatarColor,
          },
        },
        { new: true }
      );
    } else {
      updatedDepartment = "";
    }

    res.status(200).json({ updatedManager, updatedDepartment });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;

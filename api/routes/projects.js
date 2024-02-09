const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const User = require("../models/User");
const Manager = require("../models/Manager");

// GET ALL PROJECTS
router.get("/", async (req, res) => {
  try {
    const roles = await Project.find();
    res.status(200).json(roles);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE PROJECT
router.post("/", async (req, res) => {
  const newProject = new Project(req.body);
  try {
    const savedRole = await newProject.save();
    res.status(200).json(savedRole);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// DELETE PROJECT
router.delete("/:id", async (req, res) => {
  const projectId = req.params.id;
  try {
    const deletedProject = await Project.findByIdAndDelete(projectId);
    res.status(200).json(deletedProject);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE PROJECT
router.put("/", async (req, res) => {
  try {
    const updatedRole = await Project.findByIdAndUpdate(
      req.body.projectId,
      { name: "name" },
      { new: true }
    );


    res.status(200).json(updatedRole);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// CREATE PROJECT INTERACTION
router.post("/addInteraction", async (req, res) => {
  // const newProject = new Project(req.body);
  console.log("\nreq.body\n", req.body)
  // try {
  //   const savedRole = await newProject.save();
  //   res.status(200).json(savedRole);
  // } catch (err) {
  //   console.log(err);
  //   res.status(500).json(err);
  // }
});

module.exports = router;

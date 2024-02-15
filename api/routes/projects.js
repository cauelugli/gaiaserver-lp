const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const ProjectTemplate = require("../models/ProjectTemplate");
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
  let savedProjectTemplate;
  if (req.body.recurrent) {
    console.log("\nselecionado recurrent\n")
    const newProjectTemplate = new ProjectTemplate({
      title: req.body.templateName,
      creator: req.body.creator,
      type: req.body.type,
      description: req.body.description,
      mainDepartment: req.body.mainDepartment,
      members: req.body.members,
      departments: req.body.departments,
      price: req.body.price,
      stages: req.body.stages,
      attachments: req.body.attachments,
      definedStagesColors: req.body.definedStagesColors,
    });
    savedProjectTemplate = await newProjectTemplate.save();
  }
  try {
    const savedProject = await newProject.save();
    res.status(200).json({ savedProject, savedProjectTemplate });
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
  console.log("\nreq.body\n", req.body);
  // try {
  //   const savedRole = await newProject.save();
  //   res.status(200).json(savedRole);
  // } catch (err) {
  //   console.log(err);
  //   res.status(500).json(err);
  // }
});

module.exports = router;

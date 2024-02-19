const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const ProjectTemplate = require("../models/ProjectTemplate");
const User = require("../models/User");
const Manager = require("../models/Manager");

// GET ALL PROJECTS
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ALL PROJECTS TEMPLATES
router.get("/projectsTemplates", async (req, res) => {
  try {
    const templates = await ProjectTemplate.find();
    res.status(200).json(templates);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE PROJECT
router.post("/", async (req, res) => {
  const newProject = new Project(req.body);
  let savedProjectTemplate;
  if (req.body.recurrent) {
    const newProjectTemplate = new ProjectTemplate({
      title: req.body.templateName,
      creator: req.body.creator,
      type: req.body.type,
      description: req.body.description,
      mainDepartment: req.body.mainDepartment,
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
  const { projectId, stageIndex, taskIndex, interaction, user, createdAt } = req.body;

  try {
    const updatedProject = await Project.findOneAndUpdate(
      { _id: projectId, "stages.tasks": { $exists: true } },
      {
        $push: {
          [`stages.${stageIndex}.tasks.${taskIndex}.interactions`]: {
            interaction,
            user,
            createdAt,
          },
        },
      },
      { new: true }
    );

    if (updatedProject) {
      res.status(200).json(updatedProject);
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating project", error: err });
  }
});

module.exports = router;

const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const Project = require("../../models/models/Project");
const ProjectTemplate = require("../../models/models/ProjectTemplate");

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
    const updatedProject = await Project.findByIdAndUpdate(
      savedProject._id,
      {
        $push: {
          interactions: {
            number: 1,
            activity: `Projeto criado`,
            user: req.body.creator.name,
            date: req.body.createdAt,
          },
        },
      },
      { new: true }
    );
    res.status(200).json({ updatedProject, savedProjectTemplate });
  } catch (err) {
    console.log(err);
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

// ADD PROJECT INTERACTION
router.put("/interaction", async (req, res) => {
  try {
    const projectId = req.body.saleId || req.body.jobId;
    const userName = req.body.userName;

    const project = await Project.findById(projectId);
    const interactionNumber = project.interactions.length + 1;

    const updatedProject = await Project.findOneAndUpdate(
      { _id: projectId },
      {
        $push: {
          interactions: {
            number: interactionNumber,
            activity: req.body.activity,
            attachments: req.body.attachments,
            user: userName,
            date: req.body.date,
            reactions: {
              love: { quantity: 0, usersReacted: [] },
              like: { quantity: 0, usersReacted: [] },
              dislike: { quantity: 0, usersReacted: [] },
              haha: { quantity: 0, usersReacted: [] },
            },
          },
        },
      },
      { new: true }
    );
    res.status(200).json(updatedProject);
  } catch (err) {
    console.log("err", err);
    res.status(500).json(err);
  }
});

// REMOVE PROJECT INTERACTION
router.put("/interaction/remove", async (req, res) => {
  const { itemId, interactionId } = req.body;

  try {
    const project = await Project.findById(itemId);

    const updatedInteractions = project.interactions.filter(
      (interaction) => interaction._id.toString() !== interactionId
    );

    const updatedProject = await Project.findByIdAndUpdate(
      itemId,
      { $set: { interactions: updatedInteractions } },
      { new: true }
    );

    res.json(updatedProject);
  } catch (err) {
    console.error("Erro ao 'remover' interação:", err);
    res.status(500).send(err);
  }
});

// CREATE PROJECT'S TASK INTERACTION
router.post("/addInteraction", async (req, res) => {
  const {
    projectId,
    stageIndex,
    taskIndex,
    interaction,
    attachments,
    user,
    createdAt,
  } = req.body;

  try {
    const updatedProject = await Project.findOneAndUpdate(
      { _id: projectId, "stages.tasks": { $exists: true } },
      {
        $push: {
          [`stages.${stageIndex}.tasks.${taskIndex}.interactions`]: {
            interaction,
            attachments,
            reactions: {
              love: { quantity: 0, usersReacted: [] },
              like: { quantity: 0, usersReacted: [] },
              dislike: { quantity: 0, usersReacted: [] },
              haha: { quantity: 0, usersReacted: [] },
            },
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

// ADD PROJECT ATTACHMENTS
router.put("/addAttachments", async (req, res) => {
  const { itemId, attachments } = req.body;

  try {
    const project = await Project.findById(itemId);
    project.attachments = [...project.attachments, ...attachments];
    await project.save();

    res
      .status(200)
      .json({ message: "Attachments added successfully", project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred", error: err });
  }
});

// REACT TO PROJECT 'GENERAL' INTERACTION
router.put("/reaction/general", async (req, res) => {
  try {
    const itemId = req.body.itemId;
    const userId = req.body.userId;

    const project = await Project.findById(itemId);

    const reactionType = req.body.reactionType;
    const reactionField = `interactions.$.reactions.${reactionType}.quantity`;
    const usersReactedField = `interactions.$.reactions.${reactionType}.usersReacted`;

    const userAlreadyReacted = project.interactions.some((interaction) => {
      return (
        interaction.number === req.body.number &&
        interaction.reactions[reactionType].usersReacted.includes(userId)
      );
    });

    if (userAlreadyReacted) {
      const updatedProject = await Project.findOneAndUpdate(
        { _id: itemId, "interactions.number": req.body.number },
        {
          $inc: { [reactionField]: -1 },
          $pull: { [usersReactedField]: userId },
        },
        { new: true }
      );

      res.status(200).json(updatedProject);
    } else {
      const updatedProject = await Project.findOneAndUpdate(
        { _id: itemId, "interactions.number": req.body.number },
        {
          $inc: { [reactionField]: 1 },
          $addToSet: { [usersReactedField]: userId },
        },
        { new: true }
      );

      res.status(200).json(updatedProject);
    }
  } catch (err) {
    console.log("err", err);
    res.status(500).json(err);
  }
});

// REACT TO PROJECT TASK
router.put("/reaction", async (req, res) => {
  try {
    const projectId = req.body.itemId;
    const userId = req.body.userId;
    const reactionType = req.body.reactionType;
    const stageIndex = req.body.stageIndex;
    const taskIndex = req.body.taskIndex;
    const interactionIndex = req.body.interactionIndex;

    const project = await Project.findById(projectId);

    const reactionField = `stages.${stageIndex}.tasks.${taskIndex}.interactions.${interactionIndex}.reactions.${reactionType}.quantity`;
    const usersReactedField = `stages.${stageIndex}.tasks.${taskIndex}.interactions.${interactionIndex}.reactions.${reactionType}.usersReacted`;

    const userAlreadyReacted =
      project.stages[stageIndex].tasks[taskIndex].interactions[
        interactionIndex
      ].reactions[reactionType].usersReacted.includes(userId);

    if (userAlreadyReacted) {
      const updatedProject = await Project.findOneAndUpdate(
        {
          _id: projectId,
        },
        {
          $inc: { [reactionField]: -1 },
          $pull: { [usersReactedField]: userId },
        },
        { new: true }
      );

      res.status(200).json(updatedProject);
    } else {
      const updatedProject = await Project.findOneAndUpdate(
        {
          _id: projectId,
        },
        {
          $inc: { [reactionField]: 1 },
          $addToSet: { [usersReactedField]: userId },
        },
        { new: true }
      );

      res.status(200).json(updatedProject);
    }
  } catch (err) {
    console.log("err", err);
    res.status(500).json(err);
  }
});

// RESOLVE PROJECT TASK
router.post("/resolveTask", async (req, res) => {
  const { projectId, stageIndex, taskIndex, resolution, user, createdAt } =
    req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const updatedProject = await Project.findOneAndUpdate(
      {
        _id: projectId,
        "stages.tasks": { $exists: true },
      },
      {
        $push: {
          [`stages.${stageIndex}.tasks.${taskIndex}.resolution`]: {
            resolution,
            user,
            createdAt,
          },
        },
        $set: {
          [`stages.${stageIndex}.tasks.${taskIndex}.status`]: "Resolvido",
        },
      },
      { new: true }
    );

    if (updatedProject) {
      const stageTasks = updatedProject.stages[stageIndex].tasks;
      const allTasksResolved = stageTasks.every(
        (task) => task.status === "Resolvido"
      );

      if (allTasksResolved) {
        const stageStatusPath = `stages.${stageIndex}.status`;
        await Project.updateOne(
          { _id: projectId },
          {
            $set: { [stageStatusPath]: "Resolvido" },
            $inc: { currentStage: 1 },
          }
        );

        const projectWithUpdatedStage = await Project.findById(projectId);
        const allStagesResolved = projectWithUpdatedStage.stages.every(
          (stage) => stage.status === "Resolvido"
        );

        if (allStagesResolved) {
          await Project.updateOne(
            { _id: projectId },
            { $set: { status: "Concluido" } }
          );
        }

        const finalProject = await Project.findById(projectId);
        res.status(allStagesResolved ? 207 : 200).json(finalProject);
      } else {
        res.status(200).json(updatedProject);
      }
    } else {
      res.status(404).json({ message: "Project task not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error resolving task", error: err });
  }
});

// DELETE PROJECT ATTACHMENT
router.put("/deleteAttachment", async (req, res) => {
  const { projectId, attachmentIndex } = req.body;
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (attachmentIndex < 0 || attachmentIndex >= project.attachments.length) {
      return res.status(400).json({ message: "Invalid attachment index" });
    }

    const [removedAttachment] = project.attachments.splice(attachmentIndex, 1);

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { attachments: project.attachments },
      { new: true }
    );

    const attachmentPath = path.join(
      __dirname,
      "../../uploads",
      removedAttachment
    );
    if (fs.existsSync(attachmentPath)) {
      fs.unlinkSync(attachmentPath);
    }

    res.status(200).json({
      message: "Attachment deleted successfully",
      project: updatedProject,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred", error: err });
  }
});

// DELETE PROJECT
router.delete("/:id", async (req, res) => {
  const projectId = req.params.id;
  try {
    const deletedProject = await Project.findByIdAndDelete(projectId);

    if (deletedProject.attachments && deletedProject.attachments.length > 0) {
      deletedProject.attachments.forEach((attachment) => {
        const attachmentPath = path.join(
          __dirname,
          "../../uploads",
          attachment
        );
        if (fs.existsSync(attachmentPath)) {
          fs.unlinkSync(attachmentPath);
        } else {
          ("");
        }
      });
    }

    res.status(200).json(deletedProject);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

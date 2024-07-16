const express = require("express");
const router = express.Router();
const Department = require("../../models/models/Department");
const User = require("../../models/models/User");
const Manager = require("../../models/models/Manager");
const Service = require("../../models/models/Service");
const Position = require("../../models/models/Position");

// CREATE DEPARTMENT
router.post("/", async (req, res) => {
  const { name, email } = req.body;
  const existingName = await Department.findOne({ name });
  const existingEmail = await Department.findOne({ email });
  if (existingName) {
    return res
      .status(422)
      .json({ error: "Nome do Departamento já cadastrado" });
  }
  if (existingEmail) {
    return res.status(422).json({ error: "E-mail já cadastrado" });
  }
  let savedDepartment;
  let updatedManager;
  let updatedMembers = [];

  if (!req.body.manager) {
    const newDepartment = new Department({
      name: req.body.name,
      type: req.body.type,
      description: req.body.description,
      phone: req.body.phone,
      email: req.body.email,
      color: req.body.color,
      members: req.body.members,
      manager: req.body.manager,
    });
    try {
      savedDepartment = await newDepartment.save();

      // UPDATING MEMBERS
      if (req.body.members.length !== 0) {
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
      }

      res.status(200).json({ savedDepartment, updatedMembers, updatedManager });
    } catch (err) {
      console.log(err);
    }
  } else {
    const newDepartment = new Department({
      name: req.body.name,
      type: req.body.type,
      description: req.body.description,
      phone: req.body.phone,
      email: req.body.email,
      color: req.body.color,
      members: req.body.members,
      manager: req.body.manager,
    });
    const memberIds = req.body.members.map((member) => member.id);

    try {
      savedDepartment = await newDepartment.save();
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

      await Manager.findOneAndUpdate(
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
    const updatedServices = [];
    const updatedPositions = [];
    let updatedManager;

    if (deletedDepartment.members.length !== 0) {
      for (const member of deletedDepartment.members) {
        const updatedMember = await User.updateOne(
          { _id: member._id || member.id },
          {
            department: {},
          }
        );
        updatedMembers.push(updatedMember);
      }
    }

    if (deletedDepartment.services.length !== 0) {
      for (const service of deletedDepartment.services) {
        const updatedService = await Service.updateOne(
          { _id: service._id || service.id },
          { $unset: { department: "" } }
        );
        updatedServices.push(updatedService);
      }
    }

    if (deletedDepartment.positions.length !== 0) {
      for (const position of deletedDepartment.positions) {
        const updatedPosition = await Position.updateOne(
          { _id: position._id || position.id },
          {
            department: {},
          }
        );
        updatedPositions.push(updatedPosition);
      }
    }

    if (deletedDepartment.manager) {
      updatedManager = await Manager.findByIdAndUpdate(
        deletedDepartment.manager._id || deletedDepartment.manager.id,
        {
          department: {},
        }
      );
    }
    res.status(200).json({
      deletedDepartment,
      updatedMembers,
      updatedManager,
      updatedServices,
      updatedPositions,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// UPDATE DEPARTMENT
router.put("/", async (req, res) => {
  const { name, email } = req.body;
  const existingName = await Department.findOne({ name });
  const existingEmail = await Department.findOne({ email });

  if (existingName) {
    if (existingName.name !== req.body.previousData.name) {
      return res
        .status(422)
        .json({ error: "Nome do Departamento já cadastrado" });
    }
  }
  if (existingEmail) {
    if (existingEmail.email !== req.body.previousData.email) {
      return res.status(422).json({ error: "E-mail já cadastrado" });
    }
  }
  try {
    const updatedDepartment = await Department.findByIdAndUpdate(
      req.body.departmentId,
      {
        name: req.body.name,
        type: req.body.type,
        email: req.body.email,
        description: req.body.description,
        phone: req.body.phone,
        manager: req.body.manager,
        members: req.body.updatedMembers,
        color: req.body.color,
      },
      { new: true }
    );

    let updatedManager;
    let removedManager;
    let updatedMembers = [];
    let removedMembers = [];
    let updatedServices = [];
    let updatedPositions = [];

    const memberIds = req.body.updatedMembers.map(
      (member) => member._id || member.id
    );

    for (const memberId of memberIds) {
      const newAddedUpdatedMember = await User.updateOne(
        { _id: memberId },
        {
          $set: {
            "department.id": updatedDepartment._id,
            "department.name": updatedDepartment.name,
            "department.phone": updatedDepartment.phone,
            "department.email": updatedDepartment.email,
            "department.color": updatedDepartment.color,
          },
        }
      );
      updatedMembers.push(newAddedUpdatedMember);
    }

    if (updatedDepartment.services) {
      const servicesIds = updatedDepartment.services.map(
        (service) => service._id || service.id
      );

      for (const servicesId of servicesIds) {
        const newAddedUpdatedService = await Service.updateOne(
          { _id: servicesId },
          {
            $set: {
              "department.id": updatedDepartment._id,
              "department.name": updatedDepartment.name,
              "department.phone": updatedDepartment.phone,
              "department.email": updatedDepartment.email,
              "department.color": updatedDepartment.color,
            },
          }
        );
        updatedServices.push(newAddedUpdatedService);
      }
    }

    if (updatedDepartment.positions) {
      const positionsIds = updatedDepartment.positions.map(
        (position) => position._id || position.id
      );

      for (const positionsId of positionsIds) {
        const updatedPosition = await Position.updateOne(
          { _id: positionsId },
          {
            $set: {
              "department._id": updatedDepartment._id,
              "department.name": updatedDepartment.name,
              "department.type": updatedDepartment.type,
              "department.color": updatedDepartment.color,
            },
          }
        );
        updatedPositions.push(updatedPosition);
      }
    }

    const removedMemberIds = req.body.removedMembers.map(
      (member) => member._id || member.id
    );

    for (const memberId of removedMemberIds) {
      const updatedMember = await User.findOneAndUpdate(
        { _id: memberId },
        {
          $set: {
            department: {},
          },
        }
      );
      removedMembers.push(updatedMember);
    }

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
                },
              }
            ))
          : ((removedManager = await Manager.findByIdAndUpdate(
              req.body.previousManager._id || req.body.previousManager.id,
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
              },
            }
          ))
      : "";

    res.status(200).json({
      updatedDepartment,
      updatedManager,
      removedManager,
      updatedMembers,
      removedMembers,
      updatedServices,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;

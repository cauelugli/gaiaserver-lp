const express = require("express");
const router = express.Router();
const Department = require("../../models/models/Department");
const Service = require("../../models/models/Service");
const Position = require("../../models/models/Position");
const Manager = require("../../models/models/Manager");

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

module.exports = router;

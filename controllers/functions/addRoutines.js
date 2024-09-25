const Department = require("../../models/models/Department");
const Position = require("../../models/models/Position");
const Role = require("../../models/models/Role");
const Group = require("../../models/models/Group");
const User = require("../../models/models/User");

async function addRoutines(model, source) {
  try {
    const { department, position, role, members, manager } = source;
    switch (model) {
      case "User":
        if (department) {
          const updateField = source.isManager ? "manager" : "members";
          await Department.findByIdAndUpdate(department, {
            $set: { [updateField]: source._id.toString() },
          });
        }

        if (position) {
          await Position.findByIdAndUpdate(position, {
            $push: { members: source._id.toString() },
          });
        }

        if (role) {
          await Role.findByIdAndUpdate(role, {
            $push: { members: source._id.toString() },
          });
        }

        // if (groups && groups.length > 0) {
        //   await Promise.all(
        //     groups
        //       .filter((groupId) => groupId)
        //       .map((groupId) =>
        //         Group.findByIdAndUpdate(groupId, {
        //           $push: { members: source._id.toString() },
        //         })
        //       )
        //   );
        // }
        break;
      case "Department":
        if (manager) {
          await User.findByIdAndUpdate(manager, {
            $set: { department: source._id.toString() },
          });
        }

        if (members && members.length > 0) {
          await Promise.all(
            members.map((memberId) =>
              User.findByIdAndUpdate(memberId, {
                $set: { department: source._id.toString() },
              })
            )
          );
        }
        break;
      case "Service":
        if (department) {
          await Department.findByIdAndUpdate(department, {
            $set: { services: source._id.toString() },
          });
        }
        break;

      default:
        break;
    }
  } catch (err) {
    console.error(`Erro na rotina de adição em ${model}`, err);
  }
}

async function createQuote(model, source) {
  "";
}

module.exports = { addRoutines, createQuote };

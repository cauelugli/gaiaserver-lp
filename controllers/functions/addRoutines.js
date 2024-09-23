const Department = require("../../models/models/Department");
const Position = require("../../models/models/Position");
const Role = require("../../models/models/Role");
const Group = require("../../models/models/Group");
const User = require("../../models/models/User");

async function addRoutines(model, source) {
  try {
    switch (model) {
      case "User":
        const { department, position, role } = source;

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

      default:
        break;
    }
  } catch (err) {
    console.error(`Erro na rotina de adição`, err);
  }
}

module.exports = { addRoutines };

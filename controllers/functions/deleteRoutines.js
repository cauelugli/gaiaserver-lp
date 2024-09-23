const Department = require("../../models/models/Department");
const Position = require("../../models/models/Position");
const Role = require("../../models/models/Role");
const Group = require("../../models/models/Group");
const User = require("../../models/models/User");

async function deleteRoutines(model, sourceId) {
  try {
    switch (model) {
      case "User":
        const user = await User.findById(sourceId);
        if (!user) return;

        const { department, position, role, groups } = user;

        if (department) {
          const updateField = user.isManager ? "manager" : "members";

          updateField === "manager"
            ? await Department.findByIdAndUpdate(department, {
                $set: { manager: "" },
              })
            : await Department.findByIdAndUpdate(department, {
                $pull: { members: user._id.toString() },
              });
        }

        if (position) {
          await Position.findByIdAndUpdate(position, {
            $pull: { members: sourceId },
          });
        }
        if (role) {
          await Role.findByIdAndUpdate(role, { $pull: { members: sourceId } });
        }
        if (groups && groups.length > 0) {
          await Promise.all(
            groups.map((groupId) =>
              Group.findByIdAndUpdate(groupId, { $pull: { members: sourceId } })
            )
          );
        }
        break;

      default:
        break;
    }
  } catch (err) {
    console.error(`Erro na rotina de deleção`, err);
  }
}

module.exports = { deleteRoutines };

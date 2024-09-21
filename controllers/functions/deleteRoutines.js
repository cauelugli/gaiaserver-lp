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

        await Department.findByIdAndUpdate(department, {
          $pull: { members: sourceId },
        });
        await Position.findByIdAndUpdate(position, {
          $pull: { members: sourceId },
        });
        await Role.findByIdAndUpdate(role, { $pull: { members: sourceId } });

        await Promise.all(
          groups.map((groupId) =>
            Group.findByIdAndUpdate(groupId, { $pull: { members: sourceId } })
          )
        );
        break;

      default:
        break;
    }
  } catch (err) {
    console.error(`Erro na rotina de deleção`, err);
  }
}

module.exports = { deleteRoutines };

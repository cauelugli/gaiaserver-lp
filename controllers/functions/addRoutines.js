const Agenda = require("../../models/models/Agenda");
const Counters = require("../../models/models/Counters");
const Department = require("../../models/models/Department");
const Job = require("../../models/models/Job");
const Position = require("../../models/models/Position");
const Product = require("../../models/models/Product");
const Role = require("../../models/models/Role");
const Sale = require("../../models/models/Sale");
const StockEntry = require("../../models/models/StockEntry");
const User = require("../../models/models/User");
const UserPreferences = require("../../models/models/UserPreferences");

async function addRoutines(model, source) {
  try {
    const { department, position, role, members, manager } = source;
    switch (model) {
      case "User":
        if (department) {
          const updateField = source.isManager ? "manager" : "members";

          if (source.isManager) {
            await Department.findByIdAndUpdate(department, {
              $set: { [updateField]: source._id.toString() },
            });
          } else {
            await Department.findByIdAndUpdate(department, {
              $push: { [updateField]: source._id.toString() },
            });
          }
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

        const maxYears = 6;

        function generateMonths() {
          const months = [];
          const currentDate = new Date();
          const endDate = new Date(currentDate);
          endDate.setFullYear(currentDate.getFullYear() + maxYears);

          let currentMonth = currentDate.getMonth();
          let currentYear = currentDate.getFullYear();

          while (
            currentYear < endDate.getFullYear() ||
            (currentYear === endDate.getFullYear() &&
              currentMonth <= endDate.getMonth())
          ) {
            const monthString = `${String(currentMonth + 1).padStart(
              2,
              "0"
            )}-${currentYear}`;
            months.push(monthString);
            currentMonth++;

            if (currentMonth === 12) {
              currentMonth = 0;
              currentYear++;
            }
          }

          return months;
        }

        await Agenda.findOneAndUpdate(
          {},
          {
            $push: {
              users: {
                [source._id.toString()]: generateMonths().reduce(
                  (acc, month) => {
                    acc[month] = [];
                    return acc;
                  },
                  {}
                ),
              },
            },
          },
          { upsert: true }
        );

        const newUserPreferences = new UserPreferences({ userId: source._id });
        await newUserPreferences.save();

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

async function addToStock(items) {
  try {
    for (const item of items) {
      const product = await Product.findById(item._id);
      if (product) {
        product.stockQuantity += item.count;
        await product.save();
      } else {
        console.warn(`Produto com _id ${item._id} não encontrado.`);
      }
    }
  } catch (err) {
    console.error("Erro ao adicionar itens ao estoque:", err);
    throw err;
  }
}

async function addCounter(sourceId, model) {
  try {
    let counter = await Counters.findOne();
    if (!counter) {
      counter = new Counters({
        job: model === "Job" ? 1 : 0,
        sale: model === "Sale" ? 1 : 0,
        stockEntry: model === "StockEntry" ? 1 : 0,
      });
    }
    let newNumber;

    switch (model) {
      case "Job":
        newNumber = counter.job + 1;
        counter.job = newNumber;
        await Job.findByIdAndUpdate(sourceId, { $set: { number: newNumber } });
        break;
      case "Sale":
        newNumber = counter.sale + 1;
        counter.sale = newNumber;
        await Sale.findByIdAndUpdate(sourceId, { $set: { number: newNumber } });
        break;
      case "StockEntry":
        newNumber = counter.stockEntry + 1;
        counter.stockEntry = newNumber;
        await StockEntry.findByIdAndUpdate(sourceId, {
          $set: { number: newNumber },
        });
        break;
      default:
        throw new Error(`Modelo não suportado: ${model}`);
    }

    await counter.save();
  } catch (err) {
    console.error(`Erro na rotina de adição em ${model}:`, err);
  }
}

async function addToAssigneeAgenda(
  scheduledTo,
  scheduleTime,
  assignee,
  jobId,
  service,
  customer
) {
  try {
    const agenda = await Agenda.findOne();
    const [day, month, year] = scheduledTo?.split("/");
    const monthYearKey = `${month}-${year}`;

    const userIndex = agenda.users.findIndex((userMap) =>
      userMap.has(assignee)
    );

    if (userIndex === -1) {
      throw new Error("Designado não encontrado");
    }

    const userMap = agenda.users[userIndex];
    const userAgenda = userMap.get(assignee);

    if (!userAgenda) {
      console.log("Erro: usuário não encontrado na agenda");
      return;
    }

    if (!userAgenda[monthYearKey]) {
      console.log("Erro: mês nao encontrado na agenda");
      return;
    }

    userAgenda[monthYearKey].push({
      jobId,
      service,
      day,
      scheduleTime,
      status: "Aberto",
      customer,
    });

    await Agenda.findOneAndUpdate(
      {},
      { $set: { users: agenda.users } },
      { new: true }
    );

    await Job.findByIdAndUpdate(jobId, {
      $set: {
        scheduleInfo: {
          assignee,
          time: scheduleTime,
        },
      },
    });
  } catch (err) {
    console.error("Erro ao adicionar na agenda do designado", err);
  }
}

async function createQuote(model, source) {
  "";
}

module.exports = {
  addRoutines,
  addToStock,
  createQuote,
  addCounter,
  addToAssigneeAgenda,
};

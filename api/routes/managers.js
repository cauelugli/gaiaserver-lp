const express = require("express");
const router = express.Router();
const Config = require("../models/Config");
const Manager = require("../models/Manager");
const User = require("../models/User");
const UserPreferences = require("../models/UserPreferences");
const Department = require("../models/Department");

// GET ALL MANAGERS
router.get("/", async (req, res) => {
  try {
    const users = await Manager.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE MANAGER
router.post("/", async (req, res) => {
  const { name, email } = req.body;
  const existingName = await Manager.findOne({ name });
  const existingEmail = await Manager.findOne({ email });
  if (existingName) {
    return res.status(422).json({ error: "Nome de Gerente já cadastrado" });
  }
  if (existingEmail) {
    return res.status(422).json({ error: "E-mail já cadastrado" });
  }

  const newManager = new Manager(req.body);
  try {
    const savedManager = await newManager.save();
    const newUserPreferences = new UserPreferences({
      userId: savedManager._id,
    });
    await newUserPreferences.save();

    let updatedDepartment;

    // Adds the new manager to a department
    updatedDepartment = await Department.findByIdAndUpdate(
      req.body.department.id,
      {
        manager: {
          id: savedManager._id.toString(),
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          image: req.body.image,
        },
      },
      { new: true }
    );

    res.status(200).json({ savedManager, updatedDepartment });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// DELETE MANAGER
router.delete("/:id", async (req, res) => {
  const managerId = req.params.id;
  let updatedDepartment;
  try {
    const configToUpdate = await Config.findOne({
      "stock.stockentriesDispatcherDepartment.manager.id": managerId,
    });

    if (configToUpdate) {
      await Config.findOneAndUpdate(
        {
          "stock.stockentriesDispatcherDepartment.manager.id": managerId,
        },
        {
          $set: {
            "stock.stockentriesDispatcherDepartment.manager": {},
          },
        },
        { new: true }
      );
    }

    const deletedManager = await Manager.findByIdAndDelete(managerId);

    const deletedPreferences = await UserPreferences.findOneAndDelete({
      userId: managerId,
    });

    {
      deletedManager.department &&
        updatedDepartment ==
          (await Department.findByIdAndUpdate(
            deletedManager.department.id,
            { $set: { manager: "" } },
            { new: true }
          ));
    }

    res
      .status(200)
      .json({ deletedManager, deletedPreferences, updatedDepartment });
  } catch (err) {
    console.log("err", err);
    res.status(500).json(err);
  }
});

// UPDATE MANAGER
router.put("/", async (req, res) => {
  const { name, email } = req.body;
  const existingName = await Manager.findOne({ name });
  const existingEmail = await Manager.findOne({ email });

  if (existingName) {
    if (existingName.name !== req.body.previousData.name) {
      return res.status(422).json({ error: "Nome de Gerente já cadastrado" });
    }
  }
  if (existingEmail) {
    if (existingEmail.email !== req.body.previousData.email) {
      return res.status(422).json({ error: "E-mail já cadastrado" });
    }
  }
  try {
    const updatedManager = await Manager.findByIdAndUpdate(
      req.body.managerId,
      {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.body.image,
        department: req.body.department,
      },
      { new: true }
    );

    const configToUpdate = await Config.findOne({
      "stock.stockentriesDispatcherDepartment.manager.id":
        req.body.previousData._id,
    });

    if (
      configToUpdate &&
      req.body.previousData.department.name !== req.body.department.name
    ) {
      await Config.findOneAndUpdate(
        {
          "stock.stockentriesDispatcherDepartment.manager.id":
            req.body.previousData._id,
        },
        {
          $set: {
            "stock.stockentriesDispatcherDepartment.manager": {},
          },
        },
        { new: true }
      );
    }

    if (
      configToUpdate &&
      req.body.previousData.department.name === req.body.department.name
    ) {
      await Config.findOneAndUpdate(
        {
          "stock.stockentriesDispatcherDepartment.manager.id":
            req.body.previousData._id,
        },
        {
          $set: {
            "stock.stockentriesDispatcherDepartment.manager": {
              id: updatedManager.id,
              name: updatedManager.name,
              email: updatedManager.email,
              phone: updatedManager.phone,
              image: updatedManager.image,
            },
          },
        },
        { new: true }
      );
    }

    let updatedDepartment;

    updatedManager.department.id
      ? updatedManager.department.id && req.body.previousData.department
        ? updatedManager.department.id === req.body.previousData.department.id
          ? // SAME DEPT, UPDATES ONLY NEW DEPARTMENT
            (updatedDepartment = await Department.findOneAndUpdate(
              {
                _id: req.body.department.id,
              },
              {
                $set: {
                  manager: {
                    id: updatedManager.id,
                    name: updatedManager.name,
                    email: updatedManager.email,
                    phone: updatedManager.phone,
                    image: updatedManager.image,
                  },
                },
              },
              { new: true }
            ))
          : // CHANGING DEPTs, UPDATES PREVIOUS AND NEW DEPARTMENT
            (await Department.findByIdAndUpdate(
              req.body.previousData.department.id,
              {
                manager: "",
              }
            ),
            (updatedDepartment = await Department.findByIdAndUpdate(
              req.body.department.id,
              {
                manager: {
                  id: updatedManager.id,
                  name: updatedManager.name,
                  email: updatedManager.email,
                  phone: updatedManager.phone,
                  image: updatedManager.image,
                },
              },
              { new: true }
            )))
        : // ADDS MANAGER, BECAUSE HE/SHE NEVER HAD A DEPT PREVIOUSLY
          (updatedDepartment = await Department.findByIdAndUpdate(
            req.body.department.id,
            {
              manager: {
                id: updatedManager.id,
                name: updatedManager.name,
                email: updatedManager.email,
                phone: updatedManager.phone,
                image: updatedManager.image,
              },
            },
            { new: true }
          ))
      : console.log("");

    res.status(200).json({ updatedManager, updatedDepartment });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET MANAGER'S NOTIFICATIONS
router.get("/notifications/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    let userNotifications;
    userNotifications = await Manager.findById(userId).select("notifications");
    if (!userNotifications) {
      userNotifications = await User.findById(userId).select("notifications");
    }
    res.json(userNotifications.notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// MARK NOTIFICATION AS READ
router.put("/readNotification", async (req, res) => {
  try {
    const { userId, notificationId } = req.body;

    const user = await Manager.findById(userId);

    if (!user || !user.notifications[notificationId]) {
      return res.status(404).json({ success: false, error: "Not found" });
    }

    user.notifications[notificationId].status = "Lida";
    user.markModified("notifications");
    await user.save();

    return res.json({ success: true });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
});

module.exports = router;

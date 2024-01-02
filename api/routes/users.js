const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Manager = require("../models/Manager");
const Department = require("../models/Department");
const Position = require("../models/Position");

// GET ALL USERS
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE USER
router.post("/", async (req, res) => {
  const { name, email, newPosition } = req.body;
  try {
    const existingNameUser = await User.findOne({ name });
    const existingEmailUser = await User.findOne({ email });
    if (existingNameUser) {
      return res.status(422).json({ error: "Nome de Usuário já cadastrado" });
    }
    if (existingEmailUser) {
      return res.status(422).json({ error: "E-mail já cadastrado" });
    }
    if (newPosition) {
      const existingPosition = await Position.findOne({
        name: newPosition,
      });

      if (existingPosition) {
        return res.status(422).json({ error: "Cargo já cadastrado" });
      }

      const newPositionObj = new Position({ name: newPosition, members: [] });
      await newPositionObj.save();

      const newUser = new User({
        name: name,
        phone: req.body.phone,
        department: req.body.department,
        email: email,
        image: req.body.image,
        position: newPosition,
        role: req.body.role,
      });
      const savedUser = await newUser.save();

      await Department.findOneAndUpdate(
        { _id: req.body.department.id },
        {
          $addToSet: {
            members: {
              id: savedUser._id.toString(),
              name: name,
              phone: req.body.phone,
              email: email,
              image: savedUser.image,
              position: newPosition,
              role: req.body.role,
            },
          },
        },
        { upsert: true }
      );
      await Position.findOneAndUpdate(
        { _id: newPositionObj._id },
        {
          $addToSet: {
            members: savedUser._id.toString(),
          },
        },
        { upsert: true }
      );
      res.status(200).json(savedUser);
    } else {
      const newUser = new User({
        name: req.body.name,
        phone: req.body.phone,
        department: req.body.department,
        email: req.body.email,
        image: req.body.image,
        position: req.body.position.name,
        role: req.body.role,
      });
      const savedUser = await newUser.save();

      await Department.findOneAndUpdate(
        { _id: req.body.department.id },
        {
          $addToSet: {
            members: {
              id: savedUser._id.toString(),
              name: savedUser.name,
              phone: savedUser.phone,
              email: savedUser.email,
              image: savedUser.image,
              position: savedUser.position,
              role: savedUser.role,
            },
          },
        },
        { upsert: true }
      );
      await Position.findOneAndUpdate(
        { _id: req.body.position._id },
        {
          $addToSet: {
            members: savedUser._id.toString(),
          },
        },
        { upsert: true }
      );
      res.status(200).json(savedUser);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// DELETE USER
router.delete("/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    const updatedDepartment = await Department.findOneAndUpdate(
      { "members.id": userId },
      { $pull: { members: { id: userId } } },
      { new: true }
    );

    res.status(200).json({ deletedUser, updatedDepartment });
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE USER
router.put("/", async (req, res) => {
  const { name, email, option, isManager } = req.body;
  const userModel = isManager ? Manager : User;

  const existingName = await userModel.findOne({ name });
  const existingEmail = await userModel.findOne({ email });

  if (existingName) {
    if (existingName.name !== req.body.previousData.name) {
      return res.status(422).json({ error: "Nome já cadastrado" });
    }
  }
  if (existingEmail) {
    if (existingEmail.email !== req.body.previousData.email) {
      return res.status(422).json({ error: "E-mail já cadastrado" });
    }
  }

  try {
    let updateFields = {};

    if (option === "account") {
      updateFields = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.body.image,
      };
    } else {
      updateFields = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.body.image,
        department: req.body.department,
        position: req.body.position,
        role: req.body.role,
      };
      if (req.body.department) {
        updateFields.department = req.body.department;
        updateFields.position = req.body.position;
        updateFields.role = req.body.role;
      }
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      req.body.userId,
      updateFields,
      { new: true }
    );

    let updatedDepartment;

    if (option !== "account" && req.body.department) {
      updatedUser.department.id
        ? updatedUser.department.id && req.body.previousData.department
          ? updatedUser.department.id === req.body.previousData.department.id
            ? // SAME DEPT, UPDATES ONLY NEW DEPARTMENT
              (updatedDepartment = await Department.findOneAndUpdate(
                {
                  _id: req.body.department.id,
                  "members.id": req.body.userId,
                },
                {
                  $set: {
                    "members.$.name": req.body.name,
                    "members.$.phone": req.body.phone,
                    "members.$.email": req.body.email,
                    "members.$.position": req.body.position,
                    "members.$.image": req.body.image,
                    "members.$.role": req.body.role,
                  },
                },
                { new: true }
              ))
            : // CHANGING DEPTs, UPDATES PREVIOUS AND NEW DEPARTMENT
              (await Department.findOneAndUpdate(
                { "members.id": req.body.userId },
                { $pull: { members: { id: req.body.userId } } }
              ),
              (updatedDepartment = await Department.findByIdAndUpdate(
                req.body.department.id,
                {
                  $push: {
                    members: {
                      id: updatedUser.id,
                      name: updatedUser.name,
                      email: updatedUser.email,
                      phone: updatedUser.phone,
                      image: updatedUser.image,
                      position: updatedUser.position,
                      role: updatedUser.role,
                    },
                  },
                },
                { new: true }
              )))
          : // ADDS MEMBER, BECAUSE USER NEVER HAD A DEPT PREVIOUSLY
            (updatedDepartment = await Department.findByIdAndUpdate(
              req.body.department.id,
              {
                $push: {
                  members: {
                    id: updatedUser.id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    phone: updatedUser.phone,
                    position: updatedUser.position,
                    image: updatedUser.image,
                    role: updatedUser.role,
                  },
                },
              },
              { new: true }
            ))
        : "";
    }

    res.status(200).json({ updatedUser, updatedDepartment });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET USER'S NOTIFICATIONS
router.get('/notifications/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Substitua a linha abaixo pela lógica real para obter as notificações do usuário
    const userNotifications = await User.findById(userId).select('notifications');

    res.json(userNotifications.notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// MARK NOTIFICATION AS READ
router.put("/readNotification", async (req, res) => {
  try {
    const { userId, notificationId } = req.body;

    const user = await User.findById(userId);

    if (!user || !user.notifications[notificationId]) {
      return res.status(404).json({ success: false, error: "Not found" });
    }

    user.notifications[notificationId].status = "Lida";
    user.markModified('notifications');
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

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Manager = require("../models/Manager");
const Department = require("../models/Department");

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
  const { name, email } = req.body;
  try {
    const existingNameUser = await User.findOne({ name });
    const existingEmailUser = await User.findOne({ email });
    if (existingNameUser) {
      return res.status(422).json({ error: "Nome de Usuário já cadastrado" });
    }
    if (existingEmailUser) {
      return res.status(422).json({ error: "E-mail já cadastrado" });
    }

    const newUser = new User(req.body);
    const savedUser = await newUser.save();

    if (savedUser.department.id) {
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
    }

    res.status(200).json(savedUser);
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

module.exports = router;

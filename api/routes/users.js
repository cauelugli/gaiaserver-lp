const express = require("express");
const router = express.Router();
const User = require("../models/User");
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
  const newUser = new User(req.body);
  try {
    const savedUser = await newUser.save();
    {
      savedUser.department.id &&
        (await Department.findOneAndUpdate(
          { _id: req.body.department.id },
          {
            $addToSet: {
              members: {
                id: savedUser._id.toString(),
                name: savedUser.name,
                phone: savedUser.phone,
                email: savedUser.email,
                avatarColor: savedUser.avatarColor,
              },
            },
          },
          { upsert: true }
        ));
    }

    res.status(200).json(savedUser);
  } catch (err) {
    console.log(err);
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
  console.log("req.body", req.body);
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.body.userId,
      {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        department: req.body.department,
        avatarColor: req.body.avatarColor,
      },
      { new: true }
    );

    console.log("updatedUser", updatedUser, "\n");
    console.log("req.body.previousData", req.body.previousData, "\n");

    let updatedDepartment;

    updatedUser.department.id
      ? updatedUser.department.id && req.body.previousData.department
        ? updatedUser.department.id === req.body.previousData.department.id
          ? console.log("Tem, e é o mesmo")
          : console.log("Tem, mas é diferente")
        : console.log("Nunca tive um dept")
      : console.log("Nao tem, e fodase");

    //   ? updatedUser.department.id === req.body.previousData.department.id // Add the new member to the department's members array
    //     ? (updatedDepartment = await Department.findByIdAndUpdate(
    //         req.body.department.id,
    //         {
    //           $push: {
    //             members: {
    //               id: req.body.userId,
    //               name: req.body.name,
    //               email: req.body.email,
    //               phone: req.body.phone,
    //               avatarColor: req.body.avatarColor,
    //             },
    //           },
    //         },
    //         { new: true }
    //       )) // Update the existing member
    //         : (updatedDepartment = await Department.findOneAndUpdate(
    //             {
    //               _id: req.body.department.id,
    //               "members.id": req.body.userId,
    //             },
    //             {
    //               $set: {
    //                 "members.$.name": req.body.name,
    //                 "members.$.phone": req.body.phone,
    //                 "members.$.email": req.body.email,
    //                 "members.$.avatarColor": req.body.avatarColor,
    //               },
    //             },
    //             { new: true }
    //           ))
    //   : "";

    res.status(200).json({ updatedUser, updatedDepartment });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;

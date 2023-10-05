const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Manager = require("../models/Manager");

// GET ALL OPERATORS
// router.get("/", async (req, res) => {
//   try {
//     const users = await User.find();
//     res.status(200).json(users);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// // DELETE OPERATORS
// router.delete("/:id", async (req, res) => {
//   const userId = req.params.id;
//   try {
//     const deletedUser = await User.findByIdAndDelete(userId);
//     const updatedDepartment = await Department.findOneAndUpdate(
//       { "members.id": userId },
//       { $pull: { members: { id: userId } } },
//       { new: true }
//     );

//     res.status(200).json({ deletedUser, updatedDepartment });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// UPDATE OPERATOR
router.put("/", async (req, res) => {
  let type;

  req.body.operator.position ? (type = User) : (type = Manager);
  try {
    const updatedOperator = await type.findByIdAndUpdate(
      req.body.id,
      {
        username: req.body.username,
        password: req.body.password,
      },
      { new: true }
    );

    res.status(200).json(updatedOperator);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;

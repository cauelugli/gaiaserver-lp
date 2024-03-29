const express = require("express");
const router = express.Router();
const UserPreferences = require("../models/UserPreferences");

// GET USER PREFERENCES
router.get("/", async (req, res) => {
  try {
    const positions = await UserPreferences.find();
    res.status(200).json(positions);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE USER PREFERENCES
// router.put("/", async (req, res) => {
//   const { name, positionId } = req.body;
//   const existingName = await Position.findOne({ name: name });

//   try {
//     const updatedPosition = await Position.findByIdAndUpdate(
//       positionId,
//       { name: name },
//       { new: true }
//     );

//     const usersToUpdate = await User.find({ "position._id": positionId });

//     for (const user of usersToUpdate) {
//       await User.findByIdAndUpdate(
//         user._id,
//         { $set: { "position.name": updatedPosition.name } },
//         { new: true }
//       );
//     }

//     res.status(200).json(updatedPosition);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json(err);
//   }
// });

module.exports = router;

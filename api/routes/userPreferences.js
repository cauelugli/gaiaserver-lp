const express = require("express");
const router = express.Router();
const UserPreferences = require("../models/UserPreferences");

// GET USER PREFERENCES
router.get("/:userId", async (req, res) => {

  try {
    const userId = req.params.userId;

    const userPreferences = await UserPreferences.findOne({ userId: userId });

    res.status(200).json(userPreferences);
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    res.status(500).json({ error: "Internal Server Error" });
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

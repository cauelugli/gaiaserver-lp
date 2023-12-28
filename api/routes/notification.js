const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

// GET ALL NOTIFICATIONS
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE NOTIFICATION
router.post("/", async (req, res) => {
  const newNotification = new Notification({
    noteBody: req.body.noteBody,
    sender: req.body.sender,
    receiver: req.body.receiver,
    status: "Não Lida",
  });

  try {
    const note = await newNotification.save();
    console.log("\nnote", note, "\n");
    res.status(200).json(note);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// DELETE CLIENT
// router.delete("/:id", async (req, res) => {
//   const clientId = req.params.id;
//   try {
//     const deletedClient = await Client.findByIdAndDelete(clientId);
//     res.status(200).json(deletedClient);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// READ NOTIFICATION
router.put("/", async (req, res) => {
  try {
    const readNotification = await Client.findByIdAndUpdate(
      req.body.notification,
      {
        status: "Lida",
      },
      { new: true }
    );
    res.status(200).json(readNotification);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

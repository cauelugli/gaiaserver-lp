const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

// GET NOTIFICATIONS BY USER ID
router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const notifications = await Notification.find({
      "receiver.id": userId,
      status: "Não Lida",
    });
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
    res.status(200).json(note);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.put("/", async (req, res) => {
  try {
    const notificationId = req.body.notification;
    const readNotification = await Notification.findByIdAndUpdate(
      notificationId,
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

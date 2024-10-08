const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../../models/models/User");
const UserPreferences = require("../../models/models/UserPreferences");
const Department = require("../../models/models/Department");
const Position = require("../../models/models/Position");

// GET USER'S NOTIFICATIONS
router.get("/notifications/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Substitua a linha abaixo pela lógica real para obter as notificações do usuário
    const userNotifications = await User.findById(userId).select(
      "notifications"
    );

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

    const user = await User.findById(userId);

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

// MARK ALL NOTIFICATIONS AS READ
router.put("/markAllAsRead", async (req, res) => {
  try {
      const { userId } = req.body;
      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({ success: false, error: "User not found" });
      }

      Object.keys(user.notifications).forEach(key => {
          user.notifications[key].status = "Lida";
      });

      user.markModified("notifications");
      await user.save();

      return res.json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
      console.error("Error marking all notifications as read:", error);
      return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// UPDATE USER'S PROFILE PICTURE
router.put("/changeProfilePicture", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.body.userId,
      { image: req.body.image },
      { new: true }
    );
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erro ao atualizar a imagem de perfil." });
  }
});

module.exports = router;

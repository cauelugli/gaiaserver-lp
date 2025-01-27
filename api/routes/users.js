const express = require("express");
const router = express.Router();
const User = require("../../models/models/User");

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

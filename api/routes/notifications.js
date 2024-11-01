const express = require("express");
const router = express.Router();
const Notifications = require("../../models/models/Notifications");

router.put("/", async (req, res) => {
  try {
    const updatedConfig = await Notifications.findOneAndUpdate({}, req.body, {
      new: true,
    });

    res.status(200).json(updatedConfig);
  } catch (err) {
    console.error("Erro ao atualizar notificações:", err);
    res.status(500).json({ error: "Erro ao atualizar notificações" });
  }
});

module.exports = router;

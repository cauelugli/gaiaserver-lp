const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Admin = require("../../models/models/Admin");
const Counters = require("../../models/models/Counters");
const UserPreferences = require("../../models/models/UserPreferences");

// CREATE ADMIN USER
router.post("/createAdminUser", async (req, res) => {
  const existingAdmin = await Admin.findOne({ username: "admin" });

  if (existingAdmin) {
    return res.status(422).json({ error: "Já existe um Admin Cadastrado" });
  } else {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newUser = new Admin({
      password: hashedPass,
    });
    try {
      const savedUser = await newUser.save();
      const newUserPreferences = new UserPreferences({ userId: savedUser._id });
      const savedUserPreferences = await newUserPreferences.save();
      const newCounters = new Counters();
      const savedCounters = await newCounters.save();

      res.status(200).json({ savedUser, savedUserPreferences,savedCounters });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
});

// GET ADMIN CONFIG
router.get("/config", async (req, res) => {
  try {
    const adminData = await Admin.findOne();
    return res.status(200).json(adminData.config);
  } catch (error) {
    console.error("Erro ao buscar config:", error);
    return res
      .status(500)
      .json({ message: "Erro ao buscar as configurações." });
  }
});

// UPDATE ADMIN CONFIG
router.put("/config", async (req, res) => {
  try {
    const { notifyActivities } = req.body;

    const updatedAdmin = await Admin.findOneAndUpdate(
      {},
      { "config.notifyActivities": notifyActivities }
    );

    if (updatedAdmin) {
      return res
        .status(200)
        .json({ message: "Configuração atualizada com sucesso" });
    } else {
      return res
        .status(404)
        .json({ message: "Não foi possível encontrar o documento Admin" });
    }
  } catch (error) {
    console.error("Erro ao atualizar Admin:", error);
    return res.status(500).json({ message: "Erro ao atualizar Admin" });
  }
});

// UPDATE ADMIN'S PROFILE PICTURE
router.put("/changeProfilePicture", async (req, res) => {
  try {
    const updatedAdmin = await Admin.findOneAndUpdate(
      {},
      { image: req.body.image },
      { new: true }
    );
    return res.status(200).json(updatedAdmin);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erro ao atualizar a imagem de perfil." });
  }
});

router.get("/notifications", async (req, res) => {
  try {
    const adminData = await Admin.findOne();
    return res.status(200).json(adminData.notifications);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro ao buscar notificações do Admin" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../../models/models/User");
const Manager = require("../../models/models/Manager");

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        return res.status(200).json(user);
      } else {
        return res.status(403).send("Senha Incorreta");
      }
    }
    
    const manager = await Manager.findOne({ username });
    if (manager) {
      const passwordMatch = await bcrypt.compare(password, manager.password);
      if (passwordMatch) {
        return res.status(200).json(manager);
      } else {
        return res.status(403).send("Senha Incorreta");
      }
    }

    res.status(401).send("Nome de usuário incorreto");
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Erro de autenticação");
  }
});


module.exports = router;

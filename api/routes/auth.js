const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Admin = require("../../models/models/Admin");
const User = require("../../models/models/User");

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  try {
    let user;
    user = await User.findOne({ username });
    if (!user) {
      user = await Admin.findOne({ username });
    }
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        return res.status(200).json(user);
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

router.put("/changePassFirstAccess", async (req, res) => {
  const userId = req.body.userId;
  let user;

  user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    user.password = hashedPass;
    // not realy "logged in", but now is able to
    user.alreadyLogin = true;

    await user.save();

    res.status(200).json({
      message: "Senha atualizada com sucesso e acesso inicial removido.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

module.exports = router;

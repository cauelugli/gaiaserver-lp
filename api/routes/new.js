const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

// CREATE ADMIN USER
router.post("/", async (req, res) => {
  const existingAdmin = await User.findOne({ username: "admin" });

  if (existingAdmin) {
    return res.status(422).json({ error: "Já existe um Admin Cadastrado" });
  } else {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: "admin",
      password: hashedPass,
      name: "Admin",
      email: req.body.email,
      role: { id: new Date(), name: "Admin" },
    });

    try {
      const savedUser = await newUser.save();
      res.status(200).json(savedUser);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
});

module.exports = router;

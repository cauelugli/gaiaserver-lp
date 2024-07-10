const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const Role = require("../../models/models/Role");
const User = require("../../models/models/User");
const Manager = require("../../models/models/Manager");

// GET ALL OPERATORS
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    const managers = await Manager.find();
    const usersCombinedData = [
      ...users.filter((user) => user.username),
      ...managers.filter((user) => user.username),
    ];

    res.status(200).json(usersCombinedData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE OPERATOR
router.put("/", async (req, res) => {
  // defining type if User or Manager
  let type;
  req.body.operator.isManager ? (type = Manager) : (type = User);

  const { username } = req.body;

  const userExists = await type.findOne({ username });

  if (!req.body.option === "delete") {
    if (userExists) {
      return res.status(422).json({ error: "Nome de Operador já cadastrado" });
    }
  }

  if (req.body.option === "delete") {
    try {
      const updatedOperator = await type.findByIdAndUpdate(
        req.body.operatorId,
        {
          $unset: {
            username: 1,
            password: 1,
          },
          $set: {
            isFirstAccess: true,
          },
        },
        { new: true }
      );

      await Role.findByIdAndUpdate(req.body.operator.role.id, {
        $pull: { members: req.body.operatorId },
      });

      return res.status(200).json(updatedOperator);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }

  if (req.body.option === "password") {
    if (req.body.password && !req.body.username) {
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(req.body.password, salt);
      try {
        const updatedOperator = await type.findByIdAndUpdate(
          req.body.operatorId,
          {
            password: hashedPass,
          },
          { new: true }
        );
        res.status(200).json(updatedOperator);
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    } else {
      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const updatedOperator = await type.findByIdAndUpdate(
          req.body.operatorId,
          {
            username: req.body.username,
            password: hashedPass,
            role: req.body.role,
          },
          { new: true }
        );
        await Role.findByIdAndUpdate(req.body.role.id, {
          $addToSet: { members: req.body.operatorId },
        });

        res.status(200).json(updatedOperator);
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    }
  }

  if (req.body.option === "operator") {
    try {
      const updatedOperator = await type.findByIdAndUpdate(
        req.body.operatorId,
        {
          username: req.body.username,
          role: req.body.role,
        },
        { new: true }
      );

      if (req.body.role.id !== req.body.operator.role.id) {
        await Role.findByIdAndUpdate(req.body.operator.role.id, {
          $pull: { members: req.body.operatorId },
        });

        await Role.findByIdAndUpdate(req.body.role.id, {
          $addToSet: { members: req.body.operatorId },
        });
      }

      res.status(200).json(updatedOperator);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
});

module.exports = router;

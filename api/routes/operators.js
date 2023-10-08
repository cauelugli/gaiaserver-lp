const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/User");
const Manager = require("../models/Manager");

// UPDATE OPERATOR
router.put("/", async (req, res) => {
  let type;

  req.body.operator.position ? (type = User) : (type = Manager);

  if (req.body.option === "delete") {
    try {
      const updatedOperator = await type.findByIdAndUpdate(
        req.body.operatorId,
        {
          $unset: {
            username: 1,
            password: 1,
          },
        },
        { new: true }
      );

      return res.status(200).json(updatedOperator);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }

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

      res.status(200).json(updatedOperator);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
});

module.exports = router;

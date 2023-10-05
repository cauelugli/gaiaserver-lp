const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Manager = require("../models/Manager");

// UPDATE OPERATOR
router.put("/", async (req, res) => {
  let type;

  req.body.operator.position ? (type = User) : (type = Manager);
  try {
    const updatedOperator = await type.findByIdAndUpdate(
      req.body.id,
      {
        username: req.body.username,
        password: req.body.password,
      },
      { new: true }
    );

    res.status(200).json(updatedOperator);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;

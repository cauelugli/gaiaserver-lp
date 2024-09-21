const express = require("express");
const router = express.Router();
const Department = require("../../models/models/Department");
const Position = require("../../models/models/Position");
const User = require("../../models/models/User");

// GET ID INDEX LIST
router.get("/", async (req, res) => {
  const modelList = [Department, Position, User];

  try {
    let data = [];

    for (const model of modelList) {
      const items = await model.find({}, { name: 1 });
      const formattedItems = items.map((item) => ({
        name: item.name,
        id: item._id.toString(),
      }));
      data = data.concat(formattedItems);
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json(err);
  }
});

module.exports = router;

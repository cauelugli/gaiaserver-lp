const express = require("express");
const router = express.Router();
const Department = require("../../models/models/Department");
const Position = require("../../models/models/Position");
const User = require("../../models/models/User");
const Role = require("../../models/models/Role");
const Group = require("../../models/models/Group");
const Customer = require("../../models/models/Customer");
const Client = require("../../models/models/Client");
const Service = require("../../models/models/Service");

// GET ID INDEX LIST
router.get("/", async (req, res) => {
  const modelList = [
    Client,
    Customer,
    Department,
    Group,
    Position,
    Role,
    Service,
    User,
  ];

  try {
    let data = [];

    for (const model of modelList) {
      const items = await model.find({}, { name: 1, image: 1 });
      const formattedItems = items.map((item) => {
        let customerType = "";

        if (model === Customer) {
          customerType = "Customer";
        } else if (model === Client) {
          customerType = "Client";
        }

        return {
          name: item.name,
          image: item.image,
          id: item._id.toString(),
          customerType: customerType,
        };
      });

      data = data.concat(formattedItems);
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json(err);
  }
});

module.exports = router;

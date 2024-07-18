const express = require("express");
const router = express.Router();
const Config = require("../../models/models/Config");

// GET CONFIG
router.get("/", async (req, res) => {
  const { item, parameter } = req.query;

  try {
    const resConfig = await Config.find();

    let data = [];
    if (item === "services" && parameter === "serviceTypes") {
      data = resConfig[0].services.serviceTypes.map((type, index) => ({
        index,
        name: type,
      }));
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json(err);
  }
});

module.exports = router;

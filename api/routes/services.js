const express = require("express");
const router = express.Router();
const Service = require("../models/Service");

// GET ALL SERVICES
router.get("/", async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE SERVICE
router.post("/", async (req, res) => {
  const newService = new Service(req.body);
  try {
    const savedService = await newService.save();
    res.status(200).json(savedService);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// DELETE SERVICE
router.delete("/:id", async (req, res) => {
  const serviceId = req.params.id;
  try {
    const deletedService = await Service.findByIdAndDelete(serviceId);
    res.status(200).json(deletedService);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE SERVICE
router.put("/", async (req, res) => {
  try {
    const updatedService = await Service.findByIdAndUpdate(
      req.body.serviceId,
      {
        name: req.body.name,
        department: req.body.department,
        value: req.body.value,
        materials: req.body.materials,
      },
      { new: true }
    );
    res.status(200).json(updatedService);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

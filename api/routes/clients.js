const express = require("express");
const router = express.Router();
const Client = require("../models/Client");

// GET ALL CLIENTS
router.get("/", async (req, res) => {
  try {
    const clients = await Client.find();
    res.status(200).json(clients);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE CLIENT
router.post("/", async (req, res) => {
  const newClient = new Client(req.body);
  try {
    const savedClient = await newClient.save();
    res.status(200).json(savedClient);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// ACTIVATE/INACTIVATE CUSTOMER
router.put("/activate/:id", async (req, res) => {
  const clientId = req.params.id;
  try {
    const updatedClient = await Client.findByIdAndUpdate(
      clientId,
      {
        isActive: req.body.isActive,
      },
      { new: true }
    );
    res.status(200).json(updatedClient);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE CLIENT
router.delete("/:id", async (req, res) => {
  const clientId = req.params.id;
  try {
    const deletedClient = await Client.findByIdAndDelete(clientId);
    res.status(200).json(deletedClient);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE CLIENT
router.put("/", async (req, res) => {
  try {
    const updatedClient = await Client.findByIdAndUpdate(
      req.body.client,
      {
        name: req.body.name,
        email: req.body.email,
        addressHome: req.body.addressHome,
        addressDelivery: req.body.addressDelivery,
        addressBill: req.body.addressBill,
        phone: req.body.phone,
        cpf: req.body.cpf,
        birthdate: req.body.birthdate,
        gender: req.body.gender,
      },
      { new: true }
    );
    res.status(200).json(updatedClient);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

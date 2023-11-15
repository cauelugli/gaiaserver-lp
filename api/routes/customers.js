const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");

// GET ALL CUSTOMERS
router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE CUSTOMER
router.post("/", async (req, res) => {
  const { name } = req.body;
  const newCustomer = new Customer(req.body);
  try {
    const existingNameUser = await Customer.findOne({ name });
    if (existingNameUser) {
      return res.status(422).json({ error: "Nome de Cliente já cadastrado" });
    } else {
      const savedCustomer = await newCustomer.save();
      res.status(200).json(savedCustomer);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// DELETE CUSTOMER
router.delete("/:id", async (req, res) => {
  const customerId = req.params.id;
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(customerId);
    res.status(200).json(deletedCustomer);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE CUSTOMER
router.put("/", async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.body.customer,
      {
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        image: req.body.image,
        mainContactName: req.body.mainContactName,
        mainContactEmail: req.body.mainContactEmail,
        mainContactPosition: req.body.mainContactPosition,
        segment: req.body.segment,
        domain: req.body.domain,
        employees: req.body.employees,
        website: req.body.website,
        cnpj: req.body.cnpj,
      },
      { new: true }
    );
    res.status(200).json(updatedCustomer);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

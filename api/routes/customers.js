const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");
const Client = require("../models/Client");

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
      if (!req.body.config.allowSameNameCustomer) {
        return res.status(422).json({ error: "Nome de Cliente já cadastrado" });
      }
    }

    const savedCustomer = await newCustomer.save();
    res.status(200).json(savedCustomer);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// ACTIVATE/INACTIVATE CUSTOMER
router.put("/activate/:id", async (req, res) => {
  const customerId = req.params.id;
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      customerId,
      {
        isActive: req.body.isActive,
      },
      { new: true }
    );
    res.status(200).json(updatedCustomer);
  } catch (err) {
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
  const { name } = req.body;
  try {
    const existingNameUser = await Customer.findOne({ name });
    if (existingNameUser) {
      if (
        !req.body.config.allowSameNameCustomer &&
        name !== req.body.prevData.name
      ) {
        return res.status(422).json({ error: "Nome de Cliente já cadastrado" });
      }
    }

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

// CREATE CUSTOMER OR CLIENT FROM IMPORT CSV FILE
const formatString = (value, mask) => {
  const valueArray = value.split("");
  let result = "";

  for (let i = 0, j = 0; i < mask.length && j < valueArray.length; i++) {
    if (mask[i] === "0") {
      result += valueArray[j];
      j++;
    } else {
      result += mask[i];
    }
  }

  return result;
};

router.post("/importContacts", async (req, res) => {
  try {
    const fileData = req.body.fileData.slice(1, -1);
    const createdEntities = [];

    for (let i = 0; i < fileData.length; i++) {
      const row = fileData[i];
      const isCustomer =
        row[row.length - 1] !== "" && row[row.length - 1] !== Boolean(false);

      let specificData = {};

      if (isCustomer) {
        specificData = {
          name: row[0],
          cnpj: formatString(row[1], "00.000.000/0000-00"),
          phone: formatString(
            row[2],
            row[2].length === 10 ? "(00) 0000-0000" : "(00) 00000-0000"
          ),
          mainContactEmail: row[3],
          address: row[4],
        };
      } else {
        specificData = {
          name: row[0],
          cpf: formatString(row[1], "000.000.000-00"),
          phone: formatString(
            row[2],
            row[2].length === 10 ? "(00) 0000-0000" : "(00) 00000-0000"
          ),
          email: row[3],
          addressHome: row[4],
        };
      }

      const entityData = { ...specificData };

      if (isCustomer) {
        const newCustomer = new Customer(entityData);
        const savedCustomer = await newCustomer.save();
        createdEntities.push(savedCustomer);
      } else {
        const newClient = new Client(entityData);
        const savedClient = await newClient.save();
        createdEntities.push(savedClient);
      }
    }

    res.status(201).json(createdEntities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao processar a importação" });
  }
});

module.exports = router;

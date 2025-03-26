const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();
const Admin = require("../../models/models/Admin");
const Notifications = require("../../models/models/Notifications");
const Product = require("../../models/models/Product");
const mainQueue = require("../../queues/mainQueue");

// GET ALL PRODUCTS
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE PRODUCT
router.post("/", async (req, res) => {
  const newProduct = new Product({
    type: req.body.type || null,
    name: req.body.name || null,
    buyValue: parseFloat(req.body.buyValue) || null,
    sellValue: parseFloat(req.body.sellValue) || null,
    fields: req.body.fields || null,
    images: req.body.images || null,
  });
  try {
    const savedProduct = await newProduct.save();

    mainQueue.add({
      type: "notifyAdmin",
      data: savedProduct,
      method: "Adicionad",
      model: "Produto",
      isAdmin: true,
    });

    res.status(200).json(savedProduct);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// DELETE PRODUCT
router.delete("/:id", async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.findById(productId);
    const imagesPath = product.images;
    for (const imagePath of imagesPath) {
      // Exclui o arquivo da pasta de uploads
      fs.unlinkSync(path.join(__dirname, "../../uploads", imagePath));
    }
    const deletedProduct = await Product.findByIdAndDelete(productId);
    res.status(200).json(deletedProduct);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;

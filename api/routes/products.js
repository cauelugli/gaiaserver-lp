const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();
const Product = require("../../models/models/Product");

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
    type: req.body.type,
    name: req.body.name,
    buyValue: parseFloat(req.body.buyValue),
    sellValue: parseFloat(req.body.sellValue),
    fields: req.body.fields,
    images: req.body.images,
    createdBy: req.body.createdBy,
  });
  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// UPDATE PRODUCT
router.put("/", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.body.productId,
      {
        name: req.body.name,
        image: req.body.image,
        type: req.body.type,
        fields: req.body.fields,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
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

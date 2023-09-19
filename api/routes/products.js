const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

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
  if (req.body.productList && req.body.productList.length > 0) {
    try {
      const savedProducts = [];
      for (const productData of req.body.productList) {
        const newProduct = new Product(productData);
        const savedProduct = await newProduct.save();
        savedProducts.push(savedProduct);
      }
      res.status(200).json(savedProducts);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  } else {
    const newProduct = new Product(req.body);
    try {
      const savedProduct = await newProduct.save();
      res.status(200).json(savedProduct);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
});

// DELETE PRODUCT
router.delete("/:id", async (req, res) => {
  const productId = req.params.id;
  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);
    res.status(200).json(deletedProduct);
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
        brand: req.body.brand,
        image: req.body.image,
        type: req.body.type,
        model: req.body.model,
        size: req.body.size,
        groupingType: req.body.groupingType,
        sellValue: req.body.sellValue,
        buyValue: req.body.buyValue,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

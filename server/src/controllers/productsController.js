const Product = require("../models/Product");

// GET /api/products
exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    next(err);
  }
};

// POST /api/products
exports.createProduct = async (req, res, next) => {
  try {
    const { name, category, price, stockQty, minStockQty } = req.body;

    const product = await Product.create({
      name,
      category,
      price,
      stockQty,
      minStockQty,
    });

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/products/:id
exports.updateProduct = async (req, res, next) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
};
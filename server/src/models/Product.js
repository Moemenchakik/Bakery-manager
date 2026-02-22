const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["Bread", "Pastry", "Cake", "Cookies", "Drinks", "Other"],
    },
    price: { type: Number, required: true, min: 0 },
    stockQty: { type: Number, required: true, min: 0 },
    minStockQty: { type: Number, default: 5, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
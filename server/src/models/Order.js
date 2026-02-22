const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  nameSnapshot: String,
  priceSnapshot: Number,
  qty: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    phone: String,
    items: [orderItemSchema],
    total: Number,
    status: {
      type: String,
      enum: ["Pending", "Baking", "Ready", "Delivered"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
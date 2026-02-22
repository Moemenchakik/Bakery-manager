const Order = require("../models/Order");
const Product = require("../models/Product");

// GET /api/orders
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// POST /api/orders
exports.createOrder = async (req, res, next) => {
  try {
    const { customerName, phone, items } = req.body;

    let total = 0;
    const processedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.stockQty < item.qty) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }

      total += product.price * item.qty;

      processedItems.push({
        productId: product._id,
        nameSnapshot: product.name,
        priceSnapshot: product.price,
        qty: item.qty,
      });

      // decrease stock
      product.stockQty -= item.qty;
      await product.save();
    }

    const order = await Order.create({
      customerName,
      phone,
      items: processedItems,
      total,
    });

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

// GET /api/orders/:id
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/orders/:id/status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
};
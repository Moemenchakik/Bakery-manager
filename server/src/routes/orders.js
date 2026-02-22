const router = require("express").Router();
const {
  getOrders,
  createOrder,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/ordersController");

router.get("/", getOrders);
router.post("/", createOrder);
router.get("/:id", getOrderById);
router.patch("/:id/status", updateOrderStatus);

module.exports = router;
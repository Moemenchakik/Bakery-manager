const router = require("express").Router();
const {
  getProducts,
  createProduct,
  updateProduct,
} = require("../controllers/productsController");

router.get("/", getProducts);
router.post("/", createProduct);
router.patch("/:id", updateProduct);

module.exports = router;
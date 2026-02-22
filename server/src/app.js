const express = require("express");
const cors = require("cors");

const productsRoutes = require("./routes/products");
const errorHandler = require("./middleware/errorHandler");
const ordersRoutes = require("./routes/orders");

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,         // Render frontend URL
  "http://localhost:3000",         // local dev
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // allow requests with no origin (like Postman)
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: false,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bakery API running 🍞");
});

app.use("/api/products", productsRoutes);
app.use("/api/orders", ordersRoutes);
// error handler MUST be last middleware
app.use(errorHandler);

module.exports = app;
const express = require("express");
const cors = require("cors");

const productsRoutes = require("./routes/products");
const errorHandler = require("./middleware/errorHandler");
const ordersRoutes = require("./routes/orders");

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,         // Render frontend URL
  "http://localhost:3000",         // local dev
  "https://bakery-frontend-gy4c.onrender.com", // specific render frontend
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // allow requests with no origin (like Postman)
      if (!origin) return cb(null, true);
      
      // Check if origin is allowed by list OR domain
      const isAllowed = allowedOrigins.includes(origin) || origin.endsWith(".onrender.com");
      
      if (isAllowed) {
        cb(null, true);
      } else {
        console.warn(`CORS rejected origin: ${origin}`);
        cb(null, false);
      }
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
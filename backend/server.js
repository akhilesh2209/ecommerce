import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import dealsRoutes from "./routes/dealsRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

// ✅ Core middleware FIRST — before routes
app.use(cors());
app.use(helmet());
app.use(express.json());

// ✅ Rate limiter AFTER body parsing
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Verify all route modules loaded correctly
console.log("authRoutes:", typeof authRoutes);
console.log("productRoutes:", typeof productRoutes);
console.log("cartRoutes:", typeof cartRoutes);
console.log("orderRoutes:", typeof orderRoutes);
console.log("dealsRoutes:", typeof dealsRoutes);
console.log("wishlistRoutes:", typeof wishlistRoutes);

// Routes
app.get("/", (req, res) => res.json({ message: "API is running " }));
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/deals", dealsRoutes);
app.use("/api/wishlist", wishlistRoutes);

// Error middleware LAST — after all routes
app.use(notFound);
app.use(errorHandler);

// Connect DB then start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
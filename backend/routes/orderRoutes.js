import express from "express";
import mongoose from "mongoose";
import { getUserOrders, placeOrder } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Static routes FIRST
router.get("/test", (req, res) => {
  res.json({ message: "Orders route working ✅" });
});

// ✅ Place order
router.post("/", protect, placeOrder);

// ✅ Get user orders — uses authenticated user's ID from token (no param needed)
router.get("/my", protect, getUserOrders);

// ✅ Dynamic route LAST — guarded with ObjectId validation
router.get("/:userId", protect, (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
    return res.status(400).json({ message: "Invalid userId" });
  }
  getUserOrders(req, res, next);
});

export default router;
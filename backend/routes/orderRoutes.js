import express from "express";
import { getUserOrders, placeOrder } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Place a new order using the user's existing cart data
router.post("/", protect, placeOrder);

// Fetch orders for a specific user
router.get("/:userId", protect, getUserOrders);

export default router;


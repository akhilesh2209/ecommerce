import express from "express";
import { addToWishlist, removeFromWishlist, getWishlist, checkWishlist } from "../controllers/wishlistController.js";

const router = express.Router();

router.post("/", addToWishlist);
router.delete("/", removeFromWishlist);
router.get("/check", checkWishlist);
router.get("/:userId", getWishlist);

export default router;

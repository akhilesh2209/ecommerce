import Wishlist from "../models/Wishlist.js";

// ADD TO WISHLIST
export const addToWishlist = async (req, res, next) => {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId) {
      return res.status(400).json({ message: "userId and productId are required" });
    }

    // Check if already in wishlist
    const existing = await Wishlist.findOne({ user: userId, product: productId });
    if (existing) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    const wishlistItem = await Wishlist.create({
      user: userId,
      product: productId,
    });

    // Populate product details
    await wishlistItem.populate("product");

    res.status(201).json(wishlistItem);

  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }
    next(error);
  }
};

// REMOVE FROM WISHLIST
export const removeFromWishlist = async (req, res, next) => {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId) {
      return res.status(400).json({ message: "userId and productId are required" });
    }

    const result = await Wishlist.deleteOne({ user: userId, product: productId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Item not found in wishlist" });
    }

    res.json({ message: "Removed from wishlist" });

  } catch (error) {
    next(error);
  }
};

// GET USER WISHLIST
export const getWishlist = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const wishlist = await Wishlist.find({ user: userId }).populate("product");

    res.json(wishlist);

  } catch (error) {
    next(error);
  }
};

// CHECK IF PRODUCT IS IN WISHLIST
export const checkWishlist = async (req, res, next) => {
  try {
    const { userId, productId } = req.query;
    if (!userId || !productId) {
      return res.status(400).json({ message: "userId and productId are required" });
    }

    const item = await Wishlist.findOne({ user: userId, product: productId });

    res.json({ isInWishlist: !!item });

  } catch (error) {
    next(error);
  }
};

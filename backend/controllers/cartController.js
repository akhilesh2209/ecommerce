import Cart from "../models/Cart.js";

// ADD TO CART
export const addToCart = async (req, res, next) => {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId) {
      return res.status(400).json({ message: "userId and productId are required" });
    }

    const existing = await Cart.findOne({ user: userId, product: productId });

    if (existing) {
      existing.quantity += 1;
      await existing.save();
      return res.json(existing);
    }

    const cartItem = await Cart.create({
      user: userId,
      product: productId,
    });

    res.status(201).json(cartItem);

  } catch (error) {
    next(error);
  }
};

// GET CART
export const getCart = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const cart = await Cart.find({ user: userId }).populate("product");

    res.json(cart);

  } catch (error) {
    next(error);
  }
};

export const updateCart = async (req, res, next) => {
  try {
    const { cartId, quantity } = req.body;
    if (!cartId || quantity === undefined) {
      return res.status(400).json({ message: "cartId and quantity are required" });
    }

    const quantityNumber = Number(quantity);
    if (!Number.isFinite(quantityNumber)) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const item = await Cart.findById(cartId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Treat 0 or negative as a removal request
    if (quantityNumber <= 0) {
      await item.deleteOne();
      return res.json({ message: "Item removed" });
    }

    if (!Number.isInteger(quantityNumber)) {
      return res.status(400).json({ message: "Quantity must be an integer" });
    }

    item.quantity = quantityNumber;
    await item.save();

    res.json(item);

  } catch (error) {
    next(error);
  }
};
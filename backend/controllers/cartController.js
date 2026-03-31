import Cart from "../models/Cart.js";

// ADD TO CART
export const addToCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

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
    res.status(500).json({ message: error.message });
  }
};

// GET CART
export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.find({ user: userId }).populate("product");

    res.json(cart);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { cartId, quantity } = req.body;

    const item = await Cart.findById(cartId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (quantity <= 0) {
      await item.deleteOne();
      return res.json({ message: "Item removed" });
    }

    item.quantity = quantity;
    await item.save();

    res.json(item);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";

function computeTotals(subtotal) {
  const tax = subtotal * 0.08;
  const shipping = subtotal > 100 ? 0 : 15;
  const totalPrice = subtotal + tax + shipping;
  return { tax, shipping, totalPrice };
}

export const placeOrder = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.body.userId;
    const userIdStr = userId?.toString?.() || userId;

    if (!userIdStr || typeof userIdStr !== "string") {
      return res.status(400).json({ message: "userId is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(userIdStr)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const cartItems = await Cart.find({ user: userIdStr }).populate("product");

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const items = cartItems
      .filter((cartItem) => Boolean(cartItem.product))
      .map((cartItem) => ({
        product: cartItem.product._id,
        name: cartItem.product.name,
        price: cartItem.product.price,
        quantity: cartItem.quantity,
      }));

    if (items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const { tax, shipping, totalPrice } = computeTotals(subtotal);

    const order = await Order.create({
      user: userIdStr,
      items,
      subtotal,
      tax,
      shipping,
      totalPrice,
      status: "placed",
    });

    // Clear cart after successful order placement
    await Cart.deleteMany({ user: userIdStr });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

export const getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.params.userId;
    const userIdStr = userId?.toString?.() || userId;

    if (!userIdStr || typeof userIdStr !== "string") {
      return res.status(400).json({ message: "userId is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(userIdStr)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const orders = await Order.find({ user: userIdStr }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};


import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";

function computeTotals(subtotal) {
  const tax = subtotal * 0.08;
  const shipping = subtotal > 100 ? 0 : 15;
  const totalPrice = subtotal + tax + shipping;
  return { tax, shipping, totalPrice };
}

// POST /api/orders
export const placeOrder = async (req, res, next) => {
  try {
    // ✅ Always use authenticated user from token — never trust req.body.userId
    const userId = req.user._id;

    const cartItems = await Cart.find({ user: userId }).populate("product");

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
      return res.status(400).json({ message: "No valid items in cart" });
    }

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const { tax, shipping, totalPrice } = computeTotals(subtotal);

    const order = await Order.create({
      user: userId,
      items,
      subtotal,
      tax,
      shipping,
      totalPrice,
      status: "placed",
    });

    // ✅ Clear cart after order
    await Cart.deleteMany({ user: userId });

    res.status(201).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/my  OR  GET /api/orders/:userId
export const getUserOrders = async (req, res, next) => {
  try {
    // ✅ Use token user first, fall back to param (for admin use)
    const userId = req.params.userId
      ? new mongoose.Types.ObjectId(req.params.userId)
      : req.user._id;

    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};
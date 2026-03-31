import Product from "../models/Product.js";

// GET ALL PRODUCTS
export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// CREATE PRODUCT (for now simple)
export const createProduct = async (req, res, next) => {
  try {
    const { name, price, description, image, category, countInStock } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    const product = await Product.create({
      name,
      price,
      description,
      image,
      category,
      countInStock,
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};
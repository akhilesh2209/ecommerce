import mongoose from "mongoose";
import Product from "./models/Product.js";
import dotenv from "dotenv";

dotenv.config();

const sampleProducts = [
  {
    name: "Premium Wireless Headphones",
    price: 299.99,
    description: "High-quality wireless headphones with noise cancellation and premium sound quality.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    category: "Electronics",
    countInStock: 50,
  },
  {
    name: "Luxury Watch Collection",
    price: 599.99,
    description: "Elegant luxury watch with premium materials and precision craftsmanship.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
    category: "Fashion",
    countInStock: 25,
  },
  {
    name: "Premium Coffee Maker",
    price: 199.99,
    description: "Professional-grade coffee maker with multiple brewing options.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&q=80",
    category: "Home",
    countInStock: 40,
  },
  {
    name: "Smart Home Hub",
    price: 149.99,
    description: "Central control hub for all your smart home devices.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80",
    category: "Electronics",
    countInStock: 60,
  },
  {
    name: "Designer Sunglasses",
    price: 249.99,
    description: "Stylish designer sunglasses with UV protection.",
    image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=500&q=80",
    category: "Fashion",
    countInStock: 35,
  },
  {
    name: "Yoga Mat Premium",
    price: 79.99,
    description: "Extra thick yoga mat with superior grip and comfort.",
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=500&q=80",
    category: "Sports",
    countInStock: 100,
  },
  {
    name: "Portable Speaker",
    price: 129.99,
    description: "Compact portable speaker with amazing sound quality.",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80",
    category: "Electronics",
    countInStock: 75,
  },
  {
    name: "Winter Jacket",
    price: 189.99,
    description: "Warm and stylish winter jacket with water-resistant material.",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80",
    category: "Fashion",
    countInStock: 0, // Out of stock
  },
  {
    name: "LED Desk Lamp",
    price: 49.99,
    description: "Modern LED desk lamp with adjustable brightness.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80",
    category: "Home",
    countInStock: 80,
  },
  {
    name: "Gaming Mouse",
    price: 69.99,
    description: "High-precision gaming mouse with RGB lighting.",
    image: "https://images.unsplash.com/photo-1615663294758-68c104b9ad31?w=500&q=80",
    category: "Electronics",
    countInStock: 90,
  },
  {
    name: "Running Shoes",
    price: 139.99,
    description: "Professional running shoes with advanced cushioning.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
    category: "Sports",
    countInStock: 55,
  },
  {
    name: "Canvas Backpack",
    price: 89.99,
    description: "Durable canvas backpack with multiple compartments.",
    image: "https://images.unsplash.com/photo-1553062407-02eeab388d5f?w=500&q=80",
    category: "Fashion",
    countInStock: 45,
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products");

    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log("Sample products seeded successfully");

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding products:", error);
    process.exit(1);
  }
};

seedProducts();

import mongoose from "mongoose";
import Product from "./models/Product.js";
import dotenv from "dotenv";

dotenv.config();

const updateProductsWithDeals = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Get all products
    const products = await Product.find();
    
    // Update products with deals
    const dealsUpdates = [
      // Flash Deals (ending in 2-6 hours)
      {
        filter: { name: /Wireless Headphones/i },
        update: { 
          discount: 45, 
          originalPrice: 399.99, 
          dealCategory: 'flash',
          dealEndTime: new Date(Date.now() + 3 * 60 * 60 * 1000) // 3 hours from now
        }
      },
      {
        filter: { name: /Smart Home Hub/i },
        update: { 
          discount: 35, 
          originalPrice: 199.99, 
          dealCategory: 'flash',
          dealEndTime: new Date(Date.now() + 5 * 60 * 60 * 1000) // 5 hours from now
        }
      },
      {
        filter: { name: /Portable Speaker/i },
        update: { 
          discount: 50, 
          originalPrice: 179.99, 
          dealCategory: 'flash',
          dealEndTime: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours from now
        }
      },
      {
        filter: { name: /Gaming Mouse/i },
        update: { 
          discount: 40, 
          originalPrice: 99.99, 
          dealCategory: 'flash',
          dealEndTime: new Date(Date.now() + 4 * 60 * 60 * 1000) // 4 hours from now
        }
      },
      // Clearance Sale (no end time)
      {
        filter: { name: /Winter Jacket/i },
        update: { 
          discount: 60, 
          originalPrice: 299.99, 
          dealCategory: 'clearance',
          dealEndTime: null
        }
      },
      {
        filter: { name: /LED Desk Lamp/i },
        update: { 
          discount: 70, 
          originalPrice: 79.99, 
          dealCategory: 'clearance',
          dealEndTime: null
        }
      },
      {
        filter: { name: /Canvas Backpack/i },
        update: { 
          discount: 65, 
          originalPrice: 149.99, 
          dealCategory: 'clearance',
          dealEndTime: null
        }
      },
      // Weekly Specials (ending in 4 days)
      {
        filter: { name: /Luxury Watch/i },
        update: { 
          discount: 25, 
          originalPrice: 799.99, 
          dealCategory: 'weekly',
          dealEndTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000) // 4 days from now
        }
      },
      {
        filter: { name: /Premium Coffee Maker/i },
        update: { 
          discount: 30, 
          originalPrice: 249.99, 
          dealCategory: 'weekly',
          dealEndTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000) // 4 days from now
        }
      },
      {
        filter: { name: /Running Shoes/i },
        update: { 
          discount: 20, 
          originalPrice: 199.99, 
          dealCategory: 'weekly',
          dealEndTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000) // 4 days from now
        }
      },
      {
        filter: { name: /Designer Sunglasses/i },
        update: { 
          discount: 35, 
          originalPrice: 349.99, 
          dealCategory: 'weekly',
          dealEndTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000) // 4 days from now
        }
      },
    ];

    for (const { filter, update } of dealsUpdates) {
      await Product.updateMany(filter, update);
    }

    console.log("Products updated with deals successfully");

    // Verify the updates
    const flashDeals = await Product.find({ dealCategory: 'flash' });
    const clearanceDeals = await Product.find({ dealCategory: 'clearance' });
    const weeklyDeals = await Product.find({ dealCategory: 'weekly' });

    console.log(`Flash deals: ${flashDeals.length}`);
    console.log(`Clearance deals: ${clearanceDeals.length}`);
    console.log(`Weekly deals: ${weeklyDeals.length}`);

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error updating deals:", error);
    process.exit(1);
  }
};

updateProductsWithDeals();

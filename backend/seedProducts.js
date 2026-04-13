import mongoose from "mongoose";
import Product from "./models/Product.js";
import dotenv from "dotenv";

dotenv.config();

// Real Amazon-like product data
const productData = {
  electronics: [
    {
      name: "Apple iPhone 15 Pro Max 256GB",
      description: "The iPhone 15 Pro Max features a stunning titanium design, A17 Pro chip with GPU, and advanced camera systems. Capture incredible detail with 48MP Main camera. Experience iPhone in a whole new way with Dynamic Island and Always-On display.",
      price: 1199.99,
      originalPrice: 1299.99,
      category: "Cell Phones",
      subcategory: "Smartphones",
      brand: "Apple",
      images: [
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800",
        "https://images.unsplash.com/photo-1591337676887-a28a8e9a8c6a?w=800"
      ],
      specifications: {
        "Display": "6.7-inch Super Retina XDR",
        "Processor": "A17 Pro chip",
        "Storage": "256GB",
        "Camera": "48MP Main, 12MP Ultra Wide",
        "Battery": "Up to 29 hours video playback"
      },
      rating: 4.7,
      reviews: 15420,
      countInStock: 50,
      tags: ["smartphone", "apple", "5G", "pro"],
      sku: "IP15PM256",
      featured: true,
      bestseller: true,
      prime: true,
      seller: {
        name: "Apple",
        rating: 4.8,
        fulfillment: "amazon"
      }
    },
    {
      name: "Samsung Galaxy S24 Ultra 5G 512GB",
      description: "The Galaxy S24 Ultra features a 6.8-inch Dynamic AMOLED display, Snapdragon 8 Gen 3 processor, and S Pen. Capture stunning photos with 200MP main camera and enjoy all-day battery life.",
      price: 1299.99,
      originalPrice: 1399.99,
      category: "Cell Phones",
      subcategory: "Smartphones",
      brand: "Samsung",
      images: [
        "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800"
      ],
      specifications: {
        "Display": "6.8-inch Dynamic AMOLED 2X",
        "Processor": "Snapdragon 8 Gen 3",
        "Storage": "512GB",
        "Camera": "200MP Main, 12MP Ultra Wide, 10MP Telephoto",
        "Battery": "5000mAh"
      },
      rating: 4.6,
      reviews: 8932,
      countInStock: 35,
      tags: ["smartphone", "samsung", "5G", "ultra", "s-pen"],
      sku: "GS24U512",
      featured: true,
      bestseller: true,
      prime: true
    }
  ],
  computers: [
    {
      name: "MacBook Pro 14-inch M3 Pro 18GB RAM 512GB SSD",
      description: "The MacBook Pro with M3 Pro chip delivers exceptional performance for demanding workflows. Features a stunning Liquid Retina XDR display, all-day battery life, and advanced camera and audio systems.",
      price: 1999.99,
      originalPrice: 2199.99,
      category: "Computers",
      subcategory: "Laptops",
      brand: "Apple",
      images: [
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800"
      ],
      specifications: {
        "Display": "14.2-inch Liquid Retina XDR",
        "Processor": "Apple M3 Pro",
        "Memory": "18GB unified memory",
        "Storage": "512GB SSD",
        "Battery": "Up to 18 hours"
      },
      rating: 4.8,
      reviews: 6234,
      countInStock: 25,
      tags: ["laptop", "apple", "m3", "pro", "macbook"],
      sku: "MBP14M3P512",
      featured: true,
      bestseller: true,
      prime: true
    },
    {
      name: "Dell XPS 15 Laptop Intel Core i7 16GB RAM 1TB SSD",
      description: "The Dell XPS 15 combines stunning design with powerful performance. Features a 15.6-inch 4K OLED display, Intel Core i7 processor, and NVIDIA graphics for creative professionals.",
      price: 1799.99,
      originalPrice: 1999.99,
      category: "Computers",
      subcategory: "Laptops",
      brand: "Dell",
      images: [
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800"
      ],
      specifications: {
        "Display": "15.6-inch 4K OLED",
        "Processor": "Intel Core i7-13700H",
        "Memory": "16GB DDR5",
        "Storage": "1TB NVMe SSD",
        "Graphics": "NVIDIA GeForce RTX 4060"
      },
      rating: 4.5,
      reviews: 3421,
      countInStock: 30,
      tags: ["laptop", "dell", "intel", "4k", "oled"],
      sku: "XPS15I716",
      discount: 10,
      dealCategory: "weekly",
      dealEndTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      prime: true
    }
  ],
  homeKitchen: [
    {
      name: "Instant Pot Duo 7-in-1 Electric Pressure Cooker 6Qt",
      description: "The Instant Pot Duo 7-in-1 combines 7 kitchen appliances in 1: pressure cooker, slow cooker, rice cooker, steamer, sauté, yogurt maker, and warmer. Cook fast or slow, meal planning made easy.",
      price: 79.99,
      originalPrice: 99.99,
      category: "Home & Kitchen",
      subcategory: "Small Appliances",
      brand: "Instant Pot",
      images: [
        "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800"
      ],
      specifications: {
        "Capacity": "6 quarts",
        "Programs": "14 smart programs",
        "Safety": "Over 10 safety features",
        "Power": "1000W"
      },
      rating: 4.6,
      reviews: 125420,
      countInStock: 100,
      tags: ["pressure cooker", "multi-cooker", "kitchen", "instant pot"],
      sku: "IPD6QT",
      bestseller: true,
      prime: true
    },
    {
      name: "Ninja Professional Blender 1000W",
      description: "The Ninja Professional Blender features 1000 watts of professional power. Total Crushing Technology delivers unbeatable smoothness. Perfect for frozen drinks, smoothies, and food processing.",
      price: 89.99,
      originalPrice: 119.99,
      category: "Home & Kitchen",
      subcategory: "Small Appliances",
      brand: "Ninja",
      images: [
        "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800"
      ],
      specifications: {
        "Power": "1000 watts",
        "Capacity": "72 oz pitcher",
        "Speeds": "3 speeds + pulse",
        "Blades": "Total Crushing blades"
      },
      rating: 4.5,
      reviews: 45321,
      countInStock: 75,
      tags: ["blender", "kitchen", "ninja", "smoothie"],
      sku: "NB1000",
      discount: 25,
      dealCategory: "flash",
      dealEndTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      prime: true
    }
  ],
  clothing: [
    {
      name: "Nike Air Max 270 Men's Shoes",
      description: "The Nike Air Max 270 delivers visible comfort with its large Max Air unit. The shoe features a no-sew upper for comfort and durability, with foam midsole for lightweight cushioning.",
      price: 120.00,
      originalPrice: 150.00,
      category: "Clothing",
      subcategory: "Footwear",
      brand: "Nike",
      images: [
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800"
      ],
      specifications: {
        "Material": "Mesh and synthetic upper",
        "Sole": "Rubber outsole",
        "Technology": "Max Air unit",
        "Fit": "Regular fit"
      },
      rating: 4.4,
      reviews: 8765,
      countInStock: 150,
      tags: ["shoes", "nike", "air max", "running", "athletic"],
      variants: [
        { name: "Size", value: "8", price: 120.00, countInStock: 25 },
        { name: "Size", value: "9", price: 120.00, countInStock: 30 },
        { name: "Size", value: "10", price: 120.00, countInStock: 25 },
        { name: "Size", value: "11", price: 120.00, countInStock: 20 }
      ],
      sku: "NAM270",
      bestseller: true,
      prime: true
    },
    {
      name: "Levi's 501 Original Fit Men's Jeans",
      description: "The original blue jean since 1873. The Levi's 501 features a straight fit with signature button fly, and iconic leather patch. Made with sustainable materials.",
      price: 69.50,
      originalPrice: 89.50,
      category: "Clothing",
      subcategory: "Jeans",
      brand: "Levi's",
      images: [
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800"
      ],
      specifications: {
        "Material": "100% cotton",
        "Fit": "Original straight fit",
        "Closure": "Button fly",
        "Sustainability": "Water<Less technology"
      },
      rating: 4.3,
      reviews: 15432,
      countInStock: 200,
      tags: ["jeans", "levi's", "denim", "classic", "men"],
      variants: [
        { name: "Size", value: "30x32", price: 69.50, countInStock: 40 },
        { name: "Size", value: "32x32", price: 69.50, countInStock: 50 },
        { name: "Size", value: "34x32", price: 69.50, countInStock: 45 },
        { name: "Size", value: "36x32", price: 69.50, countInStock: 35 }
      ],
      sku: "LV501",
      discount: 22,
      dealCategory: "clearance",
      prime: true
    }
  ],
  beauty: [
    {
      name: "Dyson Airwrap Complete Long Styler",
      description: "The Dyson Airwrap styles hair from damp to dry using Coanda effect. Complete with 1.2-inch and 1.6-inch barrels, firm and soft smoothing brushes, and round volumizing brush.",
      price: 599.99,
      originalPrice: 649.99,
      category: "Beauty",
      subcategory: "Hair Styling",
      brand: "Dyson",
      images: [
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a372?w=800"
      ],
      specifications: {
        "Technology": "Coanda effect",
        "Heat Control": "Intelligent heat control",
        "Attachments": "6 styling attachments",
        "Power": "1300W"
      },
      rating: 4.7,
      reviews: 12450,
      countInStock: 40,
      tags: ["hair styler", "dyson", "airwrap", "styling", "professional"],
      sku: "DAWCL",
      featured: true,
      bestseller: true,
      prime: true
    }
  ]
};

// Generate more products using templates
const generateMoreProducts = () => {
  const brands = {
    "Electronics": ["Sony", "LG", "Panasonic", "Bose", "JBL", "Canon", "Nikon"],
    "Cell Phones": ["OnePlus", "Google", "Motorola", "Xiaomi", "Oppo", "Vivo"],
    "Computers": ["HP", "Lenovo", "ASUS", "Acer", "Microsoft", "Razer"],
    "Home & Kitchen": ["Cuisinart", "KitchenAid", "Breville", "Vitamix", "Breville"],
    "Clothing": ["Adidas", "Puma", "Under Armour", "New Balance", "Reebok"],
    "Beauty": ["Sephora", "Fenty Beauty", "Glossier", "Tarte", "Urban Decay"]
  };

  const productNames = {
    "Electronics": ["Wireless Headphones", "Bluetooth Speaker", "4K TV", "Sound Bar", "Gaming Console"],
    "Cell Phones": ["Budget Smartphone", "Flagship Phone", "5G Phone", "Camera Phone"],
    "Computers": ["Gaming Laptop", "Business Laptop", "All-in-One PC", "Gaming Desktop"],
    "Home & Kitchen": ["Coffee Maker", "Air Fryer", "Stand Mixer", "Food Processor"],
    "Clothing": ["Running Shoes", "T-Shirt", "Hoodie", "Jacket", "Shorts"],
    "Beauty": ["Face Serum", "Foundation", "Mascara", "Lipstick", "Eyeshadow Palette"]
  };

  const additionalProducts = [];

  Object.keys(productNames).forEach(category => {
    const categoryBrands = brands[category] || ["Generic"];
    const names = productNames[category];

    for (let i = 0; i < 50; i++) {
      const brand = categoryBrands[Math.floor(Math.random() * categoryBrands.length)];
      const name = names[Math.floor(Math.random() * names.length)];
      const price = Math.floor(Math.random() * 900) + 50;
      const originalPrice = price * (1 + Math.random() * 0.5);

      additionalProducts.push({
        name: `${brand} ${name} ${i + 1}`,
        description: `High-quality ${name.toLowerCase()} from ${brand}. Premium materials and craftsmanship meet innovative design for exceptional performance and durability.`,
        price: price,
        originalPrice: originalPrice,
        category: category,
        subcategory: "General",
        brand: brand,
        images: [`https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=800`],
        specifications: {
          "Material": "Premium materials",
          "Warranty": "1 year manufacturer warranty",
          "Origin": "Made with quality standards"
        },
        rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
        reviews: Math.floor(Math.random() * 10000) + 100,
        countInStock: Math.floor(Math.random() * 200) + 10,
        tags: [category.toLowerCase(), brand.toLowerCase(), "premium", "quality"],
        sku: `${brand.substring(0, 3).toUpperCase()}${name.substring(0, 3).toUpperCase()}${i + 1}`,
        featured: Math.random() > 0.8,
        bestseller: Math.random() > 0.7,
        newArrival: Math.random() > 0.9,
        prime: Math.random() > 0.6,
        discount: Math.random() > 0.7 ? Math.floor(Math.random() * 30) : 0
      });
    }
  });

  return additionalProducts;
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Combine real products with generated ones
    const allProducts = [
      ...Object.values(productData).flat(),
      ...generateMoreProducts()
    ];

    // Insert products
    await Product.insertMany(allProducts);
    console.log(`Seeded ${allProducts.length} products`);

    // Create indexes
    await Product.createIndexes();
    console.log('Created indexes');

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
  }
};

seedDatabase();

import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Electronics',
      'Computers',
      'Cell Phones',
      'Clothing',
      'Home & Kitchen',
      'Beauty',
      'Health',
      'Sports',
      'Toys',
      'Books',
      'Automotive',
      'Garden',
      'Office',
      'Pet Supplies',
      'Baby',
      'Tools',
      'Grocery',
      'Movies',
      'Music',
      'Games'
    ]
  },
  subcategory: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  images: [{
    type: String,
    required: true
  }],
  specifications: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: {
    type: Number,
    min: 0,
    default: 0
  },
  countInStock: {
    type: Number,
    min: 0,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  variants: [{
    name: String,
    value: String,
    price: Number,
    countInStock: Number
  }],
  featured: {
    type: Boolean,
    default: false
  },
  bestseller: {
    type: Boolean,
    default: false
  },
  newArrival: {
    type: Boolean,
    default: false
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  dealCategory: {
    type: String,
    enum: ['flash', 'clearance', 'weekly', null],
    default: null,
  },
  dealEndTime: {
    type: Date,
  },
  sku: {
    type: String,
    required: true,
    unique: true
  },
  weight: Number,
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  shippingInfo: {
    freeShipping: {
      type: Boolean,
      default: false
    },
    shippingCost: {
      type: Number,
      default: 0
    },
    deliveryDays: {
      type: Number,
      default: 3
    }
  },
  seller: {
    name: String,
    rating: Number,
    fulfillment: {
      type: String,
      enum: ['amazon', 'seller', 'prime'],
      default: 'amazon'
    }
  },
  prime: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Indexes for performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ featured: 1, bestseller: 1, newArrival: 1 });

export default mongoose.model("Product", productSchema);
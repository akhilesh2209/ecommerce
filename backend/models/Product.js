import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
  category: {
    type: String,
  },
  countInStock: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  originalPrice: {
    type: Number,
  },
  dealCategory: {
    type: String,
    enum: ['flash', 'clearance', 'weekly', null],
    default: null,
  },
  dealEndTime: {
    type: Date,
  },
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
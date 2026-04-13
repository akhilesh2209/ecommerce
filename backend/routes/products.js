import express from 'express';
import Product from '../models/Product.js';
import mongoose from 'mongoose';

const router = express.Router();

// Get all products with pagination, filtering, and sorting
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      subcategory,
      brand,
      minPrice,
      maxPrice,
      rating,
      featured,
      bestseller,
      newArrival,
      prime,
      search,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build query
    const query = {};

    // Category filters
    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    if (brand) query.brand = new RegExp(brand, 'i');

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Rating filter
    if (rating) query.rating = { $gte: parseFloat(rating) };

    // Boolean flags
    if (featured === 'true') query.featured = true;
    if (bestseller === 'true') query.bestseller = true;
    if (newArrival === 'true') query.newArrival = true;
    if (prime === 'true') query.prime = true;

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Sorting options
    const sortOptions = {};
    const validSortFields = ['price', 'rating', 'reviews', 'createdAt', 'name'];
    const sortField = validSortFields.includes(sort) ? sort : 'createdAt';
    sortOptions[sortField] = order === 'asc' ? 1 : -1;

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query with pagination
    const [products, totalProducts] = await Promise.all([
      Product.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(query)
    ]);

    // Get available categories and brands for filters
    const [categories, brands] = await Promise.all([
      Product.distinct('category'),
      Product.distinct('brand')
    ]);

    res.json({
      products,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalProducts / limitNum),
        totalProducts,
        hasNextPage: pageNum < Math.ceil(totalProducts / limitNum),
        hasPrevPage: pageNum > 1
      },
      filters: {
        categories,
        brands
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
});

// Get featured products
router.get('/featured/all', async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    
    const products = await Product.find({ featured: true })
      .sort({ rating: -1, reviews: -1 })
      .limit(parseInt(limit))
      .lean();

    res.json(products);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ message: 'Error fetching featured products', error: error.message });
  }
});

// Get bestseller products
router.get('/bestsellers/all', async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    
    const products = await Product.find({ bestseller: true })
      .sort({ rating: -1, reviews: -1 })
      .limit(parseInt(limit))
      .lean();

    res.json(products);
  } catch (error) {
    console.error('Error fetching bestsellers:', error);
    res.status(500).json({ message: 'Error fetching bestsellers', error: error.message });
  }
});

// Get new arrivals
router.get('/new-arrivals/all', async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    
    const products = await Product.find({ newArrival: true })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    res.json(products);
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    res.status(500).json({ message: 'Error fetching new arrivals', error: error.message });
  }
});

// Get products on sale/deals
router.get('/deals/all', async (req, res) => {
  try {
    const { limit = 8, category } = req.query;
    
    const query = { 
      $or: [
        { discount: { $gt: 0 } },
        { dealCategory: { $ne: null } }
      ]
    };
    
    if (category) query.category = category;

    const products = await Product.find(query)
      .sort({ discount: -1, rating: -1 })
      .limit(parseInt(limit))
      .lean();

    res.json(products);
  } catch (error) {
    console.error('Error fetching deals:', error);
    res.status(500).json({ message: 'Error fetching deals', error: error.message });
  }
});

export default router;

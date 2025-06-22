import express from 'express';
import { Product } from '../models/Product';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';
import { productService } from '../services/ProductService';

const router = express.Router();

// Get all products with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;
    
    const query: any = { isActive: true };
    
    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    // Search functionality
    if (req.query.search) {
      query.$text = { $search: req.query.search as string };
    }
    
    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice as string);
      if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice as string);
    }
    
    // Featured products filter
    if (req.query.featured === 'true') {
      query.isFeatured = true;
    }
    
    // Sort options
    let sortOptions: any = { createdAt: -1 };
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price-asc':
          sortOptions = { price: 1 };
          break;
        case 'price-desc':
          sortOptions = { price: -1 };
          break;
        case 'rating':
          sortOptions = { rating: -1 };
          break;
        case 'name':
          sortOptions = { name: 1 };
          break;
      }
    }
    
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);
    
    const total = await Product.countDocuments(query);
    
    res.json({
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isActive: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
});

// Get featured products
router.get('/featured/list', async (req, res) => {
  try {
    const products = await Product.find({ 
      isActive: true, 
      isFeatured: true 
    })
    .sort({ rating: -1 })
    .limit(8);
    
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch featured products', error: error.message });
  }
});

// Get product categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Product.distinct('category', { isActive: true });
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
  }
});

// Admin routes - Create product
router.post('/', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
});

// Admin routes - Update product
router.put('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product updated successfully', product });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
});

// Admin routes - Delete product (soft delete)
router.delete('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
});

// Admin routes - Get all products (including inactive)
router.get('/admin/all', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Product.countDocuments();
    
    res.json({
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalProducts: total
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
});

export default router;
import express from 'express';
import { Quote } from '../models/Quote';
import { Product } from '../models/Product';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Create new quote request
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { items, customerInfo, requirements } = req.body;
    
    // Validate products exist
    const quoteItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.isActive) {
        return res.status(400).json({ message: `Product ${item.productId} not found or inactive` });
      }
      
      quoteItems.push({
        product: product._id,
        productName: product.name,
        productSku: product.sku,
        quantity: item.quantity,
        estimatedPrice: product.price * item.quantity
      });
    }
    
    // Create quote
    const quote = new Quote({
      user: req.user!._id,
      items: quoteItems,
      customerInfo,
      requirements
    });
    
    await quote.save();
    
    res.status(201).json({
      message: 'Quote request submitted successfully',
      quote
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to create quote request', error: error.message });
  }
});

// Get user's quotes
router.get('/my-quotes', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    
    const quotes = await Quote.find({ user: req.user!._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('items.product', 'name images');
    
    const total = await Quote.countDocuments({ user: req.user!._id });
    
    res.json({
      quotes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalQuotes: total
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch quotes', error: error.message });
  }
});

// Get single quote
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const quote = await Quote.findOne({
      _id: req.params.id,
      user: req.user!._id
    }).populate('items.product', 'name images specifications');
    
    if (!quote) {
      return res.status(404).json({ message: 'Quote not found' });
    }
    
    res.json(quote);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch quote', error: error.message });
  }
});

// Accept quote
router.patch('/:id/accept', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const quote = await Quote.findOne({
      _id: req.params.id,
      user: req.user!._id,
      status: 'quoted'
    });
    
    if (!quote) {
      return res.status(404).json({ message: 'Quote not found or not available for acceptance' });
    }
    
    // Check if quote is still valid
    if (quote.validUntil && new Date() > quote.validUntil) {
      quote.status = 'expired';
      await quote.save();
      return res.status(400).json({ message: 'Quote has expired' });
    }
    
    quote.status = 'accepted';
    await quote.save();
    
    res.json({ message: 'Quote accepted successfully', quote });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to accept quote', error: error.message });
  }
});

// Admin routes - Get all quotes
router.get('/admin/all', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    
    const query: any = {};
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    const quotes = await Quote.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name price');
    
    const total = await Quote.countDocuments(query);
    
    res.json({
      quotes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalQuotes: total
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch quotes', error: error.message });
  }
});

// Admin routes - Update quote
router.patch('/admin/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { status, quotedAmount, validUntil, adminNotes } = req.body;
    
    const updateData: any = {};
    if (status) updateData.status = status;
    if (quotedAmount) updateData.quotedAmount = quotedAmount;
    if (validUntil) updateData.validUntil = new Date(validUntil);
    if (adminNotes) updateData.adminNotes = adminNotes;
    
    const quote = await Quote.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!quote) {
      return res.status(404).json({ message: 'Quote not found' });
    }
    
    res.json({ message: 'Quote updated successfully', quote });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to update quote', error: error.message });
  }
});

// Admin routes - Get quote statistics
router.get('/admin/stats', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const totalQuotes = await Quote.countDocuments();
    const pendingQuotes = await Quote.countDocuments({ status: 'pending' });
    const acceptedQuotes = await Quote.countDocuments({ status: 'accepted' });
    const expiredQuotes = await Quote.countDocuments({ status: 'expired' });
    
    const totalQuotedValue = await Quote.aggregate([
      { $match: { status: 'quoted', quotedAmount: { $exists: true } } },
      { $group: { _id: null, total: { $sum: '$quotedAmount' } } }
    ]);
    
    const monthlyQuotes = await Quote.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 11, 1)
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          quotes: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    res.json({
      totalQuotes,
      pendingQuotes,
      acceptedQuotes,
      expiredQuotes,
      totalQuotedValue: totalQuotedValue[0]?.total || 0,
      monthlyQuotes
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch quote statistics', error: error.message });
  }
});

export default router;
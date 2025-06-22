import express from 'express';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Create new order
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { items, shippingAddress, billingAddress, paymentMethod, notes } = req.body;
    
    // Validate and calculate order items
    const orderItems = [];
    let totalAmount = 0;
    
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.isActive) {
        return res.status(400).json({ message: `Product ${item.productId} not found or inactive` });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }
      
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;
      
      orderItems.push({
        product: product._id,
        productName: product.name,
        productSku: product.sku,
        quantity: item.quantity,
        price: product.price,
        totalPrice: itemTotal
      });
    }
    
    // Create order
    const order = new Order({
      user: req.user!._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      billingAddress,
      paymentMethod,
      notes
    });
    
    await order.save();
    
    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      );
    }
    
    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
});

// Get user's orders
router.get('/my-orders', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    
    const orders = await Order.find({ user: req.user!._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('items.product', 'name images');
    
    const total = await Order.countDocuments({ user: req.user!._id });
    
    res.json({
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalOrders: total
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

// Get single order
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user!._id
    }).populate('items.product', 'name images specifications');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch order', error: error.message });
  }
});

// Cancel order (only if pending)
router.patch('/:id/cancel', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user!._id,
      status: 'pending'
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found or cannot be cancelled' });
    }
    
    order.status = 'cancelled';
    await order.save();
    
    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      );
    }
    
    res.json({ message: 'Order cancelled successfully', order });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to cancel order', error: error.message });
  }
});

// Admin routes - Get all orders
router.get('/admin/all', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    
    const query: any = {};
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name');
    
    const total = await Order.countDocuments(query);
    
    res.json({
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalOrders: total
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

// Admin routes - Update order status
router.patch('/admin/:id/status', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { status, trackingNumber, estimatedDelivery } = req.body;
    
    const updateData: any = { status };
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (estimatedDelivery) updateData.estimatedDelivery = new Date(estimatedDelivery);
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({ message: 'Order status updated successfully', order });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to update order status', error: error.message });
  }
});

// Admin routes - Get order statistics
router.get('/admin/stats', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const completedOrders = await Order.countDocuments({ status: 'delivered' });
    
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $in: ['delivered', 'shipped', 'processing'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    const monthlyStats = await Order.aggregate([
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
          orders: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    res.json({
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      monthlyStats
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch order statistics', error: error.message });
  }
});

export default router;
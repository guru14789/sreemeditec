import express from 'express';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';
import { adminService } from '../services/AdminService';
import { databaseService } from '../services/DatabaseService';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Dashboard stats
router.get('/dashboard/stats', async (req: AuthRequest, res) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get dashboard stats', error: error.message });
  }
});

// User management
router.get('/users', async (req: AuthRequest, res) => {
  try {
    const filters = {
      page: req.query.page,
      limit: req.query.limit,
      search: req.query.search,
      role: req.query.role,
      isActive: req.query.isActive
    };
    
    const result = await adminService.getUserManagement(filters);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get users', error: error.message });
  }
});

router.patch('/users/:id/status', async (req: AuthRequest, res) => {
  try {
    const { isActive } = req.body;
    const user = await adminService.toggleUserStatus(req.params.id, isActive);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User status updated successfully', user });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to update user status', error: error.message });
  }
});

// Product management
router.get('/products', async (req: AuthRequest, res) => {
  try {
    const filters = {
      page: req.query.page,
      limit: req.query.limit,
      search: req.query.search,
      category: req.query.category,
      isActive: req.query.isActive,
      isFeatured: req.query.isFeatured
    };
    
    const result = await adminService.getProductManagement(filters);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get products', error: error.message });
  }
});

router.patch('/products/:id/stock', async (req: AuthRequest, res) => {
  try {
    const { stock } = req.body;
    const product = await adminService.updateProductStock(req.params.id, stock);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product stock updated successfully', product });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to update product stock', error: error.message });
  }
});

router.patch('/products/:id/status', async (req: AuthRequest, res) => {
  try {
    const { isActive } = req.body;
    const product = await adminService.toggleProductStatus(req.params.id, isActive);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product status updated successfully', product });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to update product status', error: error.message });
  }
});

router.patch('/products/:id/featured', async (req: AuthRequest, res) => {
  try {
    const { isFeatured } = req.body;
    const product = await adminService.toggleProductFeatured(req.params.id, isFeatured);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product featured status updated successfully', product });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to update product featured status', error: error.message });
  }
});

// Order management
router.get('/orders', async (req: AuthRequest, res) => {
  try {
    const filters = {
      page: req.query.page,
      limit: req.query.limit,
      status: req.query.status,
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };
    
    const result = await databaseService.getAllOrders(filters);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get orders', error: error.message });
  }
});

router.patch('/orders/:id/status', async (req: AuthRequest, res) => {
  try {
    const { status, adminNotes } = req.body;
    const order = await adminService.updateOrderStatus(req.params.id, status, adminNotes);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({ message: 'Order status updated successfully', order });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to update order status', error: error.message });
  }
});

// Quote management
router.get('/quotes', async (req: AuthRequest, res) => {
  try {
    const filters = {
      page: req.query.page,
      limit: req.query.limit,
      status: req.query.status
    };
    
    const result = await databaseService.getAllQuotes(filters);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get quotes', error: error.message });
  }
});

router.patch('/quotes/:id/process', async (req: AuthRequest, res) => {
  try {
    const { quotedAmount, validUntil, adminNotes } = req.body;
    const quote = await adminService.processQuote(
      req.params.id, 
      quotedAmount, 
      new Date(validUntil), 
      adminNotes
    );
    
    if (!quote) {
      return res.status(404).json({ message: 'Quote not found' });
    }
    
    res.json({ message: 'Quote processed successfully', quote });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to process quote', error: error.message });
  }
});

router.patch('/quotes/:id/status', async (req: AuthRequest, res) => {
  try {
    const { status, adminNotes } = req.body;
    const updateData: any = { status };
    if (adminNotes) updateData.adminNotes = adminNotes;
    
    const quote = await databaseService.updateQuote(req.params.id, updateData);
    
    if (!quote) {
      return res.status(404).json({ message: 'Quote not found' });
    }
    
    res.json({ message: 'Quote status updated successfully', quote });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to update quote status', error: error.message });
  }
});

// Analytics endpoints
router.get('/analytics/revenue', async (req: AuthRequest, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filters: any = {};
    
    if (startDate && endDate) {
      filters.startDate = startDate;
      filters.endDate = endDate;
    }
    
    const result = await databaseService.getAllOrders(filters);
    const revenue = result.orders.reduce((total, order) => {
      if (['completed', 'shipped', 'delivered'].includes(order.status)) {
        return total + order.totalAmount;
      }
      return total;
    }, 0);
    
    res.json({ revenue, orderCount: result.total });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get revenue analytics', error: error.message });
  }
});

router.get('/analytics/products', async (req: AuthRequest, res) => {
  try {
    const result = await databaseService.getProducts({ limit: 1000 });
    
    const categories = result.products.reduce((acc: any, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});
    
    const categoryData = Object.entries(categories).map(([category, count]) => ({
      category,
      count
    }));
    
    res.json({ categoryDistribution: categoryData, totalProducts: result.total });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get product analytics', error: error.message });
  }
});

export default router;
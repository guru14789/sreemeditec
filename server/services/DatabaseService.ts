import { Product, IProduct } from '../models/Product';
import { User, IUser } from '../models/User';
import { Order, IOrder } from '../models/Order';
import { Quote, IQuote } from '../models/Quote';
import { isMongoConnected } from '../config/database';

export class DatabaseService {
  // Product operations
  async createProduct(productData: Partial<IProduct>): Promise<IProduct> {
    if (!isMongoConnected()) {
      throw new Error('Database connection required');
    }
    
    const product = new Product(productData);
    return await product.save();
  }

  async getProducts(filters: any = {}): Promise<{ products: IProduct[], total: number }> {
    if (!isMongoConnected()) {
      return { products: [], total: 0 };
    }

    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 12;
    const skip = (page - 1) * limit;
    
    const query: any = { isActive: true };
    
    if (filters.category) {
      query.category = filters.category;
    }
    
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
        { tags: { $in: [new RegExp(filters.search, 'i')] } }
      ];
    }
    
    if (filters.minPrice || filters.maxPrice) {
      query.price = {};
      if (filters.minPrice) query.price.$gte = parseFloat(filters.minPrice);
      if (filters.maxPrice) query.price.$lte = parseFloat(filters.maxPrice);
    }
    
    if (filters.featured === 'true') {
      query.isFeatured = true;
    }
    
    let sortOptions: any = { createdAt: -1 };
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price_asc':
          sortOptions = { price: 1 };
          break;
        case 'price_desc':
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

    const [products, total] = await Promise.all([
      Product.find(query).sort(sortOptions).skip(skip).limit(limit),
      Product.countDocuments(query)
    ]);

    return { products, total };
  }

  async getProductById(id: string): Promise<IProduct | null> {
    if (!isMongoConnected()) {
      return null;
    }
    return await Product.findOne({ _id: id, isActive: true });
  }

  async updateProduct(id: string, updateData: Partial<IProduct>): Promise<IProduct | null> {
    if (!isMongoConnected()) {
      throw new Error('Database connection required');
    }
    return await Product.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteProduct(id: string): Promise<IProduct | null> {
    if (!isMongoConnected()) {
      throw new Error('Database connection required');
    }
    return await Product.findByIdAndUpdate(id, { isActive: false }, { new: true });
  }

  // User operations
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    if (!isMongoConnected()) {
      throw new Error('Database connection required');
    }
    
    const user = new User(userData);
    return await user.save();
  }

  async getUserById(id: string): Promise<IUser | null> {
    if (!isMongoConnected()) {
      return null;
    }
    return await User.findById(id).select('-password');
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    if (!isMongoConnected()) {
      return null;
    }
    return await User.findOne({ email, isActive: true });
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    if (!isMongoConnected()) {
      return null;
    }
    return await User.findOne({ username, isActive: true });
  }

  async updateUser(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
    if (!isMongoConnected()) {
      throw new Error('Database connection required');
    }
    return await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
  }

  // Order operations
  async createOrder(orderData: Partial<IOrder>): Promise<IOrder> {
    if (!isMongoConnected()) {
      throw new Error('Database connection required');
    }
    
    const order = new Order(orderData);
    return await order.save();
  }

  async getOrdersByUser(userId: string): Promise<IOrder[]> {
    if (!isMongoConnected()) {
      return [];
    }
    return await Order.find({ user: userId }).sort({ createdAt: -1 });
  }

  async getOrderById(id: string): Promise<IOrder | null> {
    if (!isMongoConnected()) {
      return null;
    }
    return await Order.findById(id).populate('user', 'firstName lastName email');
  }

  async updateOrderStatus(id: string, status: string): Promise<IOrder | null> {
    if (!isMongoConnected()) {
      throw new Error('Database connection required');
    }
    return await Order.findByIdAndUpdate(id, { status }, { new: true });
  }

  async getAllOrders(filters: any = {}): Promise<{ orders: IOrder[], total: number }> {
    if (!isMongoConnected()) {
      return { orders: [], total: 0 };
    }

    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 20;
    const skip = (page - 1) * limit;
    
    const query: any = {};
    
    if (filters.status) {
      query.status = filters.status;
    }
    
    if (filters.startDate && filters.endDate) {
      query.createdAt = {
        $gte: new Date(filters.startDate),
        $lte: new Date(filters.endDate)
      };
    }

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('user', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(query)
    ]);

    return { orders, total };
  }

  // Quote operations
  async createQuote(quoteData: Partial<IQuote>): Promise<IQuote> {
    if (!isMongoConnected()) {
      throw new Error('Database connection required');
    }
    
    const quote = new Quote(quoteData);
    return await quote.save();
  }

  async getQuotesByUser(userId: string): Promise<IQuote[]> {
    if (!isMongoConnected()) {
      return [];
    }
    return await Quote.find({ user: userId }).sort({ createdAt: -1 });
  }

  async getQuoteById(id: string): Promise<IQuote | null> {
    if (!isMongoConnected()) {
      return null;
    }
    return await Quote.findById(id).populate('user', 'firstName lastName email');
  }

  async updateQuote(id: string, updateData: Partial<IQuote>): Promise<IQuote | null> {
    if (!isMongoConnected()) {
      throw new Error('Database connection required');
    }
    return await Quote.findByIdAndUpdate(id, updateData, { new: true });
  }

  async getAllQuotes(filters: any = {}): Promise<{ quotes: IQuote[], total: number }> {
    if (!isMongoConnected()) {
      return { quotes: [], total: 0 };
    }

    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 20;
    const skip = (page - 1) * limit;
    
    const query: any = {};
    
    if (filters.status) {
      query.status = filters.status;
    }

    const [quotes, total] = await Promise.all([
      Quote.find(query)
        .populate('user', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Quote.countDocuments(query)
    ]);

    return { quotes, total };
  }

  // Analytics operations
  async getAnalytics(): Promise<any> {
    if (!isMongoConnected()) {
      return {
        totalProducts: 0,
        totalUsers: 0,
        totalOrders: 0,
        totalRevenue: 0,
        recentOrders: [],
        topProducts: []
      };
    }

    const [
      totalProducts,
      totalUsers,
      totalOrders,
      recentOrders,
      topProducts,
      revenueData
    ] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      User.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Order.find().sort({ createdAt: -1 }).limit(10).populate('user', 'firstName lastName email'),
      Product.find({ isActive: true }).sort({ rating: -1, reviewCount: -1 }).limit(5),
      Order.aggregate([
        { $match: { status: { $in: ['completed', 'shipped', 'delivered'] } } },
        { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
      ])
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    return {
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue,
      recentOrders,
      topProducts
    };
  }
}

export const databaseService = new DatabaseService();
import { databaseService } from './DatabaseService';
import { IOrder } from '../models/Order';
import { IUser } from '../models/User';
import { IProduct } from '../models/Product';
import { IQuote } from '../models/Quote';

export interface AdminStats {
  overview: {
    totalProducts: number;
    totalUsers: number;
    totalOrders: number;
    totalRevenue: number;
    monthlyRevenue: number;
    pendingOrders: number;
    activeQuotes: number;
  };
  recentActivity: {
    recentOrders: IOrder[];
    recentUsers: IUser[];
    pendingQuotes: IQuote[];
  };
  topPerformers: {
    topProducts: IProduct[];
    topCategories: Array<{ category: string; count: number; revenue: number }>;
  };
  charts: {
    monthlyRevenue: Array<{ month: string; revenue: number }>;
    orderStatus: Array<{ status: string; count: number }>;
    categoryDistribution: Array<{ category: string; count: number }>;
  };
}

export class AdminService {
  async getDashboardStats(): Promise<AdminStats> {
    const baseAnalytics = await databaseService.getAnalytics();
    
    // Get additional admin-specific data
    const [
      monthlyRevenue,
      pendingOrdersCount,
      activeQuotesCount,
      recentUsers,
      pendingQuotes,
      topCategories,
      monthlyRevenueChart,
      orderStatusChart,
      categoryChart
    ] = await Promise.all([
      this.getMonthlyRevenue(),
      this.getPendingOrdersCount(),
      this.getActiveQuotesCount(),
      this.getRecentUsers(),
      this.getPendingQuotes(),
      this.getTopCategories(),
      this.getMonthlyRevenueChart(),
      this.getOrderStatusChart(),
      this.getCategoryDistributionChart()
    ]);

    return {
      overview: {
        ...baseAnalytics,
        monthlyRevenue,
        pendingOrders: pendingOrdersCount,
        activeQuotes: activeQuotesCount
      },
      recentActivity: {
        recentOrders: baseAnalytics.recentOrders,
        recentUsers,
        pendingQuotes
      },
      topPerformers: {
        topProducts: baseAnalytics.topProducts,
        topCategories
      },
      charts: {
        monthlyRevenue: monthlyRevenueChart,
        orderStatus: orderStatusChart,
        categoryDistribution: categoryChart
      }
    };
  }

  private async getMonthlyRevenue(): Promise<number> {
    const result = await databaseService.getAllOrders({
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      endDate: new Date()
    });
    
    return result.orders.reduce((total, order) => {
      if (['completed', 'shipped', 'delivered'].includes(order.status)) {
        return total + order.totalAmount;
      }
      return total;
    }, 0);
  }

  private async getPendingOrdersCount(): Promise<number> {
    const result = await databaseService.getAllOrders({ status: 'pending' });
    return result.total;
  }

  private async getActiveQuotesCount(): Promise<number> {
    const result = await databaseService.getAllQuotes({ status: 'pending' });
    return result.total;
  }

  private async getRecentUsers(): Promise<IUser[]> {
    // This would need to be implemented in DatabaseService
    return [];
  }

  private async getPendingQuotes(): Promise<IQuote[]> {
    const result = await databaseService.getAllQuotes({ status: 'pending', limit: 5 });
    return result.quotes;
  }

  private async getTopCategories(): Promise<Array<{ category: string; count: number; revenue: number }>> {
    // This would need aggregation pipeline in DatabaseService
    return [];
  }

  private async getMonthlyRevenueChart(): Promise<Array<{ month: string; revenue: number }>> {
    const months = [];
    const currentDate = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 1);
      
      const result = await databaseService.getAllOrders({
        startDate: date,
        endDate: nextMonth
      });
      
      const revenue = result.orders.reduce((total, order) => {
        if (['completed', 'shipped', 'delivered'].includes(order.status)) {
          return total + order.totalAmount;
        }
        return total;
      }, 0);
      
      months.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        revenue
      });
    }
    
    return months;
  }

  private async getOrderStatusChart(): Promise<Array<{ status: string; count: number }>> {
    const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    const statusCounts = [];
    
    for (const status of statuses) {
      const result = await databaseService.getAllOrders({ status });
      statusCounts.push({ status, count: result.total });
    }
    
    return statusCounts;
  }

  private async getCategoryDistributionChart(): Promise<Array<{ category: string; count: number }>> {
    // This would need aggregation pipeline in DatabaseService
    return [];
  }

  async updateOrderStatus(orderId: string, status: string, adminNotes?: string): Promise<IOrder | null> {
    const updateData: any = { status };
    if (adminNotes) {
      updateData.adminNotes = adminNotes;
    }
    
    return await databaseService.updateOrderStatus(orderId, status);
  }

  async processQuote(quoteId: string, quotedAmount: number, validUntil: Date, adminNotes?: string): Promise<IQuote | null> {
    const updateData: any = {
      status: 'quoted',
      quotedAmount,
      validUntil,
      adminNotes
    };
    
    return await databaseService.updateQuote(quoteId, updateData);
  }

  async getUserManagement(filters: any = {}): Promise<{ users: IUser[], total: number }> {
    // This would need to be implemented in DatabaseService
    return { users: [], total: 0 };
  }

  async toggleUserStatus(userId: string, isActive: boolean): Promise<IUser | null> {
    return await databaseService.updateUser(userId, { isActive });
  }

  async getProductManagement(filters: any = {}): Promise<{ products: IProduct[], total: number }> {
    return await databaseService.getProducts(filters);
  }

  async updateProductStock(productId: string, stock: number): Promise<IProduct | null> {
    return await databaseService.updateProduct(productId, { stock });
  }

  async toggleProductStatus(productId: string, isActive: boolean): Promise<IProduct | null> {
    return await databaseService.updateProduct(productId, { isActive });
  }

  async toggleProductFeatured(productId: string, isFeatured: boolean): Promise<IProduct | null> {
    return await databaseService.updateProduct(productId, { isFeatured });
  }
}

export const adminService = new AdminService();
import { Product as MongoProduct, IProduct } from '../models/Product';
import { isMongoConnected } from '../config/database';

export class ProductService {
  async getAllProducts(filters: any = {}) {
    if (isMongoConnected()) {
      return this.getMongoProducts(filters);
    } else {
      // Return empty result for demo - user should provide MongoDB connection
      return {
        products: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalProducts: 0,
          hasNextPage: false,
          hasPrevPage: false
        }
      };
    }
  }

  async getProductById(id: string) {
    if (isMongoConnected()) {
      return await MongoProduct.findOne({ _id: id, isActive: true });
    } else {
      return null;
    }
  }

  async getFeaturedProducts() {
    if (isMongoConnected()) {
      return await MongoProduct.find({ 
        isActive: true, 
        isFeatured: true 
      }).sort({ rating: -1 }).limit(8);
    } else {
      return [];
    }
  }

  async getCategories() {
    if (isMongoConnected()) {
      return await MongoProduct.distinct('category', { isActive: true });
    } else {
      return [];
    }
  }

  async createProduct(productData: any) {
    if (isMongoConnected()) {
      const product = new MongoProduct(productData);
      return await product.save();
    } else {
      throw new Error('Database connection required for product creation');
    }
  }

  async updateProduct(id: string, productData: any) {
    if (isMongoConnected()) {
      return await MongoProduct.findByIdAndUpdate(id, productData, { new: true });
    } else {
      throw new Error('Database connection required for product updates');
    }
  }

  async deleteProduct(id: string) {
    if (isMongoConnected()) {
      return await MongoProduct.findByIdAndUpdate(id, { isActive: false }, { new: true });
    } else {
      throw new Error('Database connection required for product deletion');
    }
  }

  private async getMongoProducts(filters: any) {
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 12;
    const skip = (page - 1) * limit;
    
    const query: any = { isActive: true };
    
    if (filters.category) {
      query.category = filters.category;
    }
    
    if (filters.search) {
      query.$text = { $search: filters.search };
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
    if (filters.sort) {
      switch (filters.sort) {
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
    
    const products = await MongoProduct.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);
    
    const total = await MongoProduct.countDocuments(query);
    
    return {
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    };
  }
}

export const productService = new ProductService();
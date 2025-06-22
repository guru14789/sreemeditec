import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory?: string;
  images: string[];
  specifications: {
    brand?: string;
    model?: string;
    weight?: string;
    dimensions?: string;
    warranty?: string;
    certifications?: string[];
    [key: string]: any;
  };
  stock: number;
  sku: string;
  isActive: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
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
  category: {
    type: String,
    required: true,
    trim: true,
    enum: ['Medical Equipment', 'Hospital Furniture', 'Diagnostics', 'Surgery', 'ICU Equipment', 'Patient Monitoring', 'Mobility Aids', 'Laboratory', 'Emergency', 'Other']
  },
  subcategory: {
    type: String,
    trim: true
  },
  images: [{
    type: String,
    required: true
  }],
  specifications: {
    type: Schema.Types.Mixed,
    default: {}
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    min: 0,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  seoTitle: {
    type: String,
    maxlength: 60
  },
  seoDescription: {
    type: String,
    maxlength: 160
  }
}, {
  timestamps: true
});

// Indexes for better performance
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ rating: -1 });
ProductSchema.index({ isFeatured: -1, isActive: 1 });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
import mongoose, { Document, Schema } from 'mongoose';

export interface IQuoteItem {
  product: mongoose.Types.ObjectId;
  productName: string;
  productSku: string;
  quantity: number;
  estimatedPrice?: number;
}

export interface IQuote extends Document {
  _id: string;
  quoteNumber: string;
  user: mongoose.Types.ObjectId;
  items: IQuoteItem[];
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company: string;
    jobTitle?: string;
  };
  requirements: string;
  status: 'pending' | 'reviewed' | 'quoted' | 'accepted' | 'rejected' | 'expired';
  quotedAmount?: number;
  validUntil?: Date;
  notes?: string;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuoteItemSchema = new Schema<IQuoteItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  productSku: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  estimatedPrice: {
    type: Number,
    min: 0
  }
});

const QuoteSchema = new Schema<IQuote>({
  quoteNumber: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [QuoteItemSchema],
  customerInfo: {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    company: {
      type: String,
      required: true,
      trim: true
    },
    jobTitle: {
      type: String,
      trim: true
    }
  },
  requirements: {
    type: String,
    required: true,
    maxlength: 2000
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'quoted', 'accepted', 'rejected', 'expired'],
    default: 'pending'
  },
  quotedAmount: {
    type: Number,
    min: 0
  },
  validUntil: {
    type: Date
  },
  notes: {
    type: String,
    maxlength: 1000
  },
  adminNotes: {
    type: String,
    maxlength: 1000
  }
}, {
  timestamps: true
});

// Generate quote number before saving
QuoteSchema.pre('save', async function(next) {
  if (!this.quoteNumber) {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.quoteNumber = `QT-${timestamp}-${random}`;
  }
  next();
});

// Indexes
QuoteSchema.index({ quoteNumber: 1 }, { unique: true });
QuoteSchema.index({ user: 1, createdAt: -1 });
QuoteSchema.index({ status: 1 });

export const Quote = mongoose.model<IQuote>('Quote', QuoteSchema);
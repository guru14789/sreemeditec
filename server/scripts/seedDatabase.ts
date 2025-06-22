import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Product } from '../models/Product';
import connectDB from '../config/database';

const seedData = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    
    console.log('Creating admin user...');
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const adminUser = new User({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isActive: true
    });
    await adminUser.save();
    
    console.log('Creating sample products...');
    
    // Create sample products
    const products = [
      {
        name: 'Premium Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation and premium sound quality. Perfect for music lovers and professionals.',
        price: 299.99,
        category: 'Electronics',
        subcategory: 'Audio',
        images: ['/hero1.jpeg'],
        specifications: {
          brand: 'AudioTech',
          model: 'AT-WH1000',
          weight: '250g',
          dimensions: '18 x 15 x 8 cm',
          warranty: '2 years',
          certifications: ['CE', 'FCC', 'RoHS']
        },
        stock: 50,
        sku: 'WH-001',
        isActive: true,
        isFeatured: true,
        rating: 4.8,
        reviewCount: 127,
        tags: ['wireless', 'noise-cancellation', 'premium', 'bluetooth'],
        seoTitle: 'Premium Wireless Headphones - AudioTech AT-WH1000',
        seoDescription: 'Experience premium sound quality with our wireless headphones featuring advanced noise cancellation technology.'
      },
      {
        name: 'Smart Fitness Tracker',
        description: 'Advanced fitness tracker with heart rate monitoring, GPS, and smartphone connectivity. Track your health and fitness goals.',
        price: 199.99,
        category: 'Electronics',
        subcategory: 'Wearables',
        images: ['/download.jpeg'],
        specifications: {
          brand: 'FitPro',
          model: 'FP-ST200',
          weight: '35g',
          dimensions: '4 x 2 x 1 cm',
          warranty: '1 year',
          certifications: ['IP68', 'CE', 'FCC']
        },
        stock: 75,
        sku: 'FT-002',
        isActive: true,
        isFeatured: true,
        rating: 4.6,
        reviewCount: 89,
        tags: ['fitness', 'smartwatch', 'health', 'gps'],
        seoTitle: 'Smart Fitness Tracker - FitPro FP-ST200',
        seoDescription: 'Track your fitness goals with our advanced smart fitness tracker featuring GPS and heart rate monitoring.'
      },
      {
        name: 'Ergonomic Office Chair',
        description: 'Premium ergonomic office chair designed for long hours of comfortable work. Features adjustable height and lumbar support.',
        price: 449.99,
        category: 'Furniture',
        subcategory: 'Office',
        images: ['/hero1.jpeg'],
        specifications: {
          brand: 'ErgoDesk',
          model: 'ED-CH500',
          weight: '18kg',
          dimensions: '65 x 65 x 120 cm',
          warranty: '5 years',
          certifications: ['GREENGUARD', 'BIFMA']
        },
        stock: 25,
        sku: 'CH-003',
        isActive: true,
        isFeatured: false,
        rating: 4.7,
        reviewCount: 203,
        tags: ['ergonomic', 'office', 'chair', 'comfort'],
        seoTitle: 'Ergonomic Office Chair - ErgoDesk ED-CH500',
        seoDescription: 'Work comfortably all day with our premium ergonomic office chair featuring adjustable lumbar support.'
      },
      {
        name: 'Professional Camera Lens',
        description: 'High-performance camera lens for professional photography. Compatible with major camera brands and perfect for portraits.',
        price: 899.99,
        category: 'Electronics',
        subcategory: 'Photography',
        images: ['/download.jpeg'],
        specifications: {
          brand: 'LensCraft',
          model: 'LC-85mm',
          weight: '600g',
          dimensions: '8 x 8 x 12 cm',
          warranty: '3 years',
          certifications: ['Professional Grade']
        },
        stock: 15,
        sku: 'CL-004',
        isActive: true,
        isFeatured: true,
        rating: 4.9,
        reviewCount: 45,
        tags: ['camera', 'lens', 'photography', 'professional'],
        seoTitle: 'Professional Camera Lens - LensCraft LC-85mm',
        seoDescription: 'Capture stunning photos with our professional-grade camera lens designed for portrait photography.'
      },
      {
        name: 'Modern Table Lamp',
        description: 'Sleek and modern table lamp with adjustable brightness. Perfect accent lighting for any room or office space.',
        price: 89.99,
        category: 'Home & Garden',
        subcategory: 'Lighting',
        images: ['/hero1.jpeg'],
        specifications: {
          brand: 'LightWorks',
          model: 'LW-TL100',
          weight: '1.2kg',
          dimensions: '25 x 15 x 40 cm',
          warranty: '2 years',
          certifications: ['UL', 'Energy Star']
        },
        stock: 100,
        sku: 'TL-005',
        isActive: true,
        isFeatured: false,
        rating: 4.4,
        reviewCount: 76,
        tags: ['lamp', 'lighting', 'modern', 'adjustable'],
        seoTitle: 'Modern Table Lamp - LightWorks LW-TL100',
        seoDescription: 'Illuminate your space with our sleek modern table lamp featuring adjustable brightness control.'
      },
      {
        name: 'Wireless Charging Pad',
        description: 'Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicator.',
        price: 39.99,
        category: 'Electronics',
        subcategory: 'Accessories',
        images: ['/download.jpeg'],
        specifications: {
          brand: 'ChargeTech',
          model: 'CT-WCP10',
          weight: '200g',
          dimensions: '10 x 10 x 1 cm',
          warranty: '1 year',
          certifications: ['Qi Certified', 'CE', 'FCC']
        },
        stock: 200,
        sku: 'WC-006',
        isActive: true,
        isFeatured: true,
        rating: 4.3,
        reviewCount: 156,
        tags: ['wireless', 'charging', 'phone', 'accessories'],
        seoTitle: 'Fast Wireless Charging Pad - ChargeTech CT-WCP10',
        seoDescription: 'Charge your devices wirelessly with our fast-charging pad compatible with all Qi-enabled smartphones.'
      }
    ];
    
    await Product.insertMany(products);
    
    console.log('Database seeded successfully!');
    console.log(`Created ${products.length} products`);
    console.log('Admin user created with credentials:');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
  }
};

// Run if called directly
if (require.main === module) {
  seedData();
}

export default seedData;
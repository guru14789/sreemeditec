// MongoDB initialization script for Docker deployment
// This script creates the database and initial collections

db = db.getSiblingDB('ecommerce_db');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['username', 'email', 'password', 'firstName', 'lastName'],
      properties: {
        username: {
          bsonType: 'string',
          minLength: 3,
          maxLength: 50
        },
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        },
        password: {
          bsonType: 'string',
          minLength: 6
        },
        firstName: {
          bsonType: 'string',
          maxLength: 50
        },
        lastName: {
          bsonType: 'string',
          maxLength: 50
        },
        role: {
          bsonType: 'string',
          enum: ['user', 'admin']
        },
        isActive: {
          bsonType: 'bool'
        }
      }
    }
  }
});

db.createCollection('products', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'description', 'price', 'category', 'sku'],
      properties: {
        name: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 200
        },
        description: {
          bsonType: 'string',
          maxLength: 2000
        },
        price: {
          bsonType: 'number',
          minimum: 0
        },
        category: {
          bsonType: 'string'
        },
        sku: {
          bsonType: 'string'
        },
        stock: {
          bsonType: 'number',
          minimum: 0
        },
        isActive: {
          bsonType: 'bool'
        },
        isFeatured: {
          bsonType: 'bool'
        }
      }
    }
  }
});

db.createCollection('orders');
db.createCollection('quotes');

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });

db.products.createIndex({ sku: 1 }, { unique: true });
db.products.createIndex({ category: 1 });
db.products.createIndex({ name: 'text', description: 'text', tags: 'text' });
db.products.createIndex({ isActive: 1, isFeatured: 1 });
db.products.createIndex({ price: 1 });

db.orders.createIndex({ orderNumber: 1 }, { unique: true });
db.orders.createIndex({ user: 1 });
db.orders.createIndex({ status: 1 });
db.orders.createIndex({ createdAt: -1 });

db.quotes.createIndex({ quoteNumber: 1 }, { unique: true });
db.quotes.createIndex({ user: 1 });
db.quotes.createIndex({ status: 1 });
db.quotes.createIndex({ createdAt: -1 });

print('Database initialization completed successfully');
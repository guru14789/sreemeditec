import { Express } from 'express';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss';

export const setupProductionMiddleware = (app: Express) => {
  // Rate limiting
  const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
    message: {
      error: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use('/api', limiter);

  // Data sanitization against NoSQL injection attacks
  app.use(mongoSanitize({
    replaceWith: '_'
  }));

  // Sanitize user input from malicious HTML
  app.use((req, res, next) => {
    if (req.body) {
      for (const key in req.body) {
        if (typeof req.body[key] === 'string') {
          req.body[key] = xss(req.body[key]);
        }
      }
    }
    next();
  });
};

export const productionConfig = {
  mongodb: {
    options: {
      maxPoolSize: 20,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      bufferMaxEntries: 0,
      retryWrites: true,
      w: 'majority'
    }
  },
  
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12'),
    jwtExpiresIn: '7d',
    sessionTimeout: 1000 * 60 * 60 * 24 * 7 // 7 days
  },
  
  fileUpload: {
    maxSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    uploadPath: process.env.UPLOAD_PATH || 'uploads/'
  }
};
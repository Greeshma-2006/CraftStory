require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connectDatabase = require('./config/database');
const User = require('./models/User');

const app = express();


// ======================
// Database Connection
// ======================

connectDatabase();


// ======================
// Middleware
// ======================

app.use(
  cors({
    origin:
      process.env.CORS_ORIGINS || '*',
    credentials: true,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);


// ======================
// Seed Admin Account
// ======================

const seedAdmin = async () => {
  try {

    const adminEmail =
      process.env.ADMIN_EMAIL ||
      'admin@craftstory.com';

    const existingAdmin =
      await User.findOne({
        email: adminEmail,
      });

    if (!existingAdmin) {

      await User.create({
        name: 'Admin',

        email: adminEmail,

        password:
          process.env.ADMIN_PASSWORD ||
          'Admin@123',

        role: 'admin',

        isEmailVerified: true,
      });

      console.log(
        'Admin account created successfully'
      );

    } else {

      console.log(
        'Admin already exists'
      );

    }

  } catch (error) {

    console.error(
      'Error seeding admin:',
      error.message
    );

  }
};


// ======================
// Routes
// ======================

app.use(
  '/api/auth',
  require('./routes/auth')
);

app.use(
  '/api/admin',
  require('./routes/admin')
);

app.use(
  '/api/artisans',
  require('./routes/artisan')
);

app.use(
  '/api/products',
  require('./routes/products')
);

app.use(
  '/api/stories',
  require('./routes/stories')
);

app.use(
  '/api/cart',
  require('./routes/cart')
);

app.use(
  '/api/wishlist',
  require('./routes/wishlist')
);

app.use(
  '/api/orders',
  require('./routes/orders')
);

app.use(
  '/api/payment',
  require('./routes/payment')
);

app.use(
  '/api/upload',
  require('./routes/upload')
);

/* NEW */

app.use(
  '/api/reviews',
  require('./routes/reviews')
);

app.use(
  '/api/reports',
  require('./routes/reports')
);


// ======================
// Health Route
// ======================

app.get(
  '/api/health',
  (req, res) => {

    res.status(200).json({
      success: true,
      message:
        'CraftStory API is running',
      timestamp:
        new Date().toISOString(),
    });

  }
);


// ======================
// Root Route
// ======================

app.get(
  '/api',
  (req, res) => {

    res.status(200).json({
      success: true,
      message:
        'Welcome to CraftStory API',
      version: '1.0.0',
    });

  }
);


// ======================
// Error Middleware
// ======================

app.use(
  (err, req, res, next) => {

    console.error(
      err.stack
    );

    res.status(
      err.statusCode || 500
    ).json({
      success: false,
      message:
        err.message ||
        'Internal Server Error',
    });

  }
);


// ======================
// 404 Middleware
// ======================

app.use(
  (req, res) => {

    res.status(404).json({
      success: false,
      message:
        'Route not found',
    });

  }
);


// ======================
// Start Server
// ======================

const PORT =
  process.env.PORT || 8001;

app.listen(
  PORT,
  async () => {

    console.log(
      `Server running on port ${PORT}`
    );

    console.log(
      `Environment: ${
        process.env.NODE_ENV ||
        'development'
      }`
    );

    await seedAdmin();

  }
);

module.exports = app;
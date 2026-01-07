// Load environment variables FIRST before any other imports
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const statusRoutes = require('./api/routes/statusRoutes');
const healthRoutes = require('./api/routes/healthRoutes');
const analyticsRoutes = require('./api/routes/analyticsRoutes');
const contactRoutes = require('./api/routes/contactRoutes');
const logger = require('./api/middleware/logger');
const errorHandler = require('./api/middleware/errorHandler');
const { connectToDatabase, client, isDatabaseConnected } = require('./config/db');
const { initializeTransporter } = require('./utils/emailService');

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(logger);

// CORS Configuration - supports both development and production
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://ak-live.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl, etc.)
    if (!origin) return callback(null, true);

    // Check if origin is in allowed list or is a Vercel preview deployment
    const isAllowed = allowedOrigins.some(allowed =>
      origin === allowed || origin.includes('vercel.app')
    );

    if (isAllowed || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Basic API endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Portfolio Backend API is running!',
    database: isDatabaseConnected() ? 'Connected' : 'Not connected (using fallback)',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api', statusRoutes);
app.use('/api', healthRoutes);
app.use('/api', analyticsRoutes);
app.use('/api', contactRoutes);

// Error handling middleware (should be last)
app.use(errorHandler);

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  if (client && isDatabaseConnected()) {
    await client.close();
  }
  process.exit(0);
});

// Start server
async function startServer() {
  try {
    // Try to connect to database (non-blocking)
    await connectToDatabase();

    // Initialize email service
    initializeTransporter();

    // Start server regardless of database connection
    app.listen(PORT, () => {
      console.log('🚀 Portfolio Backend Server');
      console.log(`📡 Server running on port ${PORT}`);
      console.log(`🌐 API available at: http://localhost:${PORT}/api`);
      console.log('💾 Database:', isDatabaseConnected() ? 'Connected' : 'Fallback mode');
      console.log('\n--- Server Ready ---\n');
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

startServer();
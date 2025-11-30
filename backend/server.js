const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const statusRoutes = require('./api/routes/statusRoutes');
const healthRoutes = require('./api/routes/healthRoutes');
const logger = require('./api/middleware/logger');
const errorHandler = require('./api/middleware/errorHandler');
const { connectToDatabase, client, isDatabaseConnected } = require('./config/db');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(logger);
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
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
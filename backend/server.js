const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const statusRoutes = require('./api/routes/statusRoutes');
const healthRoutes = require('./api/routes/healthRoutes');
const logger = require('./api/middleware/logger');
const errorHandler = require('./api/middleware/errorHandler');
const { connectToDatabase, client } = require('./config/db');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(logger);
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', statusRoutes);
app.use('/api', healthRoutes);

// Error handling middleware (should be last)
app.use(errorHandler);

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await client.close();
  process.exit(0);
});

// Start server
async function startServer() {
  await connectToDatabase();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch(console.error);
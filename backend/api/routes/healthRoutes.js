const express = require('express');
const { getDatabase, isDatabaseConnected } = require('../../config/db');

const router = express.Router();

// Health check endpoint
router.get('/health', async (req, res) => {
  const startTime = Date.now();
  
  try {
    let dbStatus = 'disconnected';
    let dbError = null;
    
    if (isDatabaseConnected()) {
      try {
        const db = getDatabase();
        await db.command({ ping: 1 });
        dbStatus = 'connected';
      } catch (error) {
        dbStatus = 'error';
        dbError = error.message;
      }
    }
    
    const responseTime = Date.now() - startTime;
    
    const healthData = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'portfolio-backend',
      uptime: process.uptime(),
      responseTime: `${responseTime}ms`,
      database: {
        status: dbStatus,
        error: dbError
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100
      },
      environment: process.env.NODE_ENV || 'development'
    };
    
    // Return 200 even if database is disconnected (service is still functional)
    res.status(200).json(healthData);
    
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      service: 'portfolio-backend',
      error: error.message,
      uptime: process.uptime()
    });
  }
});

// Simple ping endpoint
router.get('/ping', (req, res) => {
  res.json({
    message: 'pong',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
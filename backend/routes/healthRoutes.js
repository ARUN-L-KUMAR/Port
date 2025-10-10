const express = require('express');
const { getDatabase } = require('../config/db');

const router = express.Router();

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    const db = getDatabase();
    // Try to run a simple command to check database connectivity
    await db.command({ ping: 1 });
    
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'portfolio-backend'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      service: 'portfolio-backend',
      error: error.message
    });
  }
});

module.exports = router;
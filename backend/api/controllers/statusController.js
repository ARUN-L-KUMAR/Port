const StatusCheck = require('../models/StatusCheck');
const { getDatabase } = require('../../config/db');
const { validateStatusCheck } = require('../../utils/validation');

// Get all status checks
async function getStatusChecks(req, res) {
  try {
    const db = getDatabase();
    const collection = db.collection('status_checks');
    const statusChecks = await collection.find({}).limit(1000).toArray();
    
    res.json(statusChecks);
  } catch (error) {
    console.error('Error fetching status checks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Create a new status check
async function createStatusCheck(req, res) {
  try {
    // Validate request data
    const validation = validateStatusCheck(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.errors
      });
    }
    
    const statusData = req.body;
    const statusObj = new StatusCheck(statusData);
    
    const db = getDatabase();
    const collection = db.collection('status_checks');
    const result = await collection.insertOne(statusObj.toObject());
    
    res.status(201).json(statusObj.toObject());
  } catch (error) {
    console.error('Error creating status check:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get root endpoint
function getRoot(req, res) {
  res.json({ message: 'Hello World' });
}

module.exports = {
  getStatusChecks,
  createStatusCheck,
  getRoot
};
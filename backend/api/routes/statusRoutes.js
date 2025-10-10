const express = require('express');
const { getStatusChecks, createStatusCheck, getRoot } = require('../controllers/statusController');

const router = express.Router();

// Define routes
router.get('/', getRoot);
router.post('/status', createStatusCheck);
router.get('/status', getStatusChecks);

module.exports = router;
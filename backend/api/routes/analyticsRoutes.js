const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const adminAuth = require('../middleware/adminAuth');

// Public routes - for tracking visitors
router.post('/analytics/track', analyticsController.trackVisit);
router.post('/analytics/event', analyticsController.trackEvent);
router.post('/analytics/heartbeat', analyticsController.heartbeat);

// Protected routes - admin only
router.get('/analytics/stats', adminAuth, analyticsController.getStats);
router.get('/analytics/visitors', adminAuth, analyticsController.getVisitors);
router.get('/analytics/live', adminAuth, analyticsController.getLiveCount);
router.get('/analytics/events', adminAuth, analyticsController.getEvents);

// Admin auth
router.post('/analytics/login', analyticsController.adminLogin);

module.exports = router;

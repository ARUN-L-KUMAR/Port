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
router.get('/analytics/extended-stats', adminAuth, analyticsController.getExtendedStats);
router.get('/analytics/top-projects', adminAuth, analyticsController.getTopProjects);
router.get('/analytics/visitors', adminAuth, analyticsController.getVisitors);
router.get('/analytics/live', adminAuth, analyticsController.getLiveCount);
router.get('/analytics/events', adminAuth, analyticsController.getEvents);

// Admin auth
router.post('/analytics/login', analyticsController.adminLogin);

// Clear all data (admin only)
router.delete('/analytics/clear-all', adminAuth, analyticsController.clearAllData);

module.exports = router;

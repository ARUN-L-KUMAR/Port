const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const adminAuth = require('../middleware/adminAuth');

// Public routes - for tracking visitors
router.post('/analytics/track', analyticsController.trackVisit);
router.post('/analytics/event', analyticsController.trackEvent);
router.post('/analytics/heartbeat', analyticsController.heartbeat);
router.get('/analytics/public-config', analyticsController.getAnalyticsPublicConfig);

// Protected routes - admin only
router.get('/analytics/stats', adminAuth, analyticsController.getStats);
router.get('/analytics/extended-stats', adminAuth, analyticsController.getExtendedStats);
router.get('/analytics/top-projects', adminAuth, analyticsController.getTopProjects);
router.get('/analytics/visitors', adminAuth, analyticsController.getVisitors);
router.get('/analytics/live', adminAuth, analyticsController.getLiveCount);
router.get('/analytics/events', adminAuth, analyticsController.getEvents);
router.get('/analytics/status', adminAuth, analyticsController.getAnalyticsStatus);
router.post('/analytics/status', adminAuth, analyticsController.setAnalyticsStatus);

// Admin auth
router.post('/analytics/login', analyticsController.adminLogin);

// Clear all data (admin only)
router.delete('/analytics/clear-all', adminAuth, analyticsController.clearAllData);

module.exports = router;

const { getDatabase } = require('../../config/db');
const { v4: uuidv4 } = require('uuid');
const { sendLinkedInVisitorNotification } = require('../../utils/emailService');

// In-memory store for active sessions (for live count)
const activeSessions = new Map();

// Session timeout (1 minute without heartbeat = inactive)
const SESSION_TIMEOUT = 60000;

// Helper: Parse user agent for device/browser info
const parseUserAgent = (userAgent) => {
    if (!userAgent) return { device: 'Unknown', browser: 'Unknown' };

    let device = 'Desktop';
    if (/Mobile|Android|iPhone|iPad/i.test(userAgent)) {
        device = /iPad/i.test(userAgent) ? 'Tablet' : 'Mobile';
    }

    let browser = 'Unknown';
    if (/Chrome/i.test(userAgent) && !/Edg/i.test(userAgent)) browser = 'Chrome';
    else if (/Firefox/i.test(userAgent)) browser = 'Firefox';
    else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) browser = 'Safari';
    else if (/Edg/i.test(userAgent)) browser = 'Edge';
    else if (/Opera|OPR/i.test(userAgent)) browser = 'Opera';

    return { device, browser };
};

// Helper: Get approximate location from IP (free API)
const getLocationFromIP = async (ip) => {
    try {
        // Skip for localhost/private IPs
        if (!ip || ip === '::1' || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
            return { country: 'Local', city: 'Development' };
        }

        const response = await fetch(`http://ip-api.com/json/${ip}?fields=country,city`);
        const data = await response.json();
        return { country: data.country || 'Unknown', city: data.city || 'Unknown' };
    } catch (error) {
        console.error('Location lookup failed:', error.message);
        return { country: 'Unknown', city: 'Unknown' };
    }
};

// Helper: Parse referrer to identify source
const parseReferrer = (referrer) => {
    if (!referrer) return 'Direct';

    const url = referrer.toLowerCase();
    // LinkedIn detection - includes mobile app package names
    if (url.includes('linkedin.com') || url.includes('linkedin.android') || url.includes('com.linkedin')) {
        return 'LinkedIn';
    }
    if (url.includes('google.com')) return 'Google';
    if (url.includes('github.com')) return 'GitHub';
    if (url.includes('twitter.com') || url.includes('x.com')) return 'Twitter/X';
    if (url.includes('facebook.com')) return 'Facebook';
    if (url.includes('instagram.com')) return 'Instagram';

    // Try to extract domain
    try {
        const domain = new URL(referrer).hostname.replace('www.', '');
        return domain;
    } catch {
        return 'Other';
    }
};

// Clean up inactive sessions periodically
setInterval(() => {
    const now = Date.now();
    for (const [sessionId, session] of activeSessions) {
        if (now - session.lastSeen > SESSION_TIMEOUT) {
            activeSessions.delete(sessionId);
        }
    }
}, 30000);

// Track a new visit
exports.trackVisit = async (req, res) => {
    try {
        const db = getDatabase();
        const { sessionId: clientSessionId, path, referrer } = req.body;

        // Get client IP
        const ip = req.headers['x-forwarded-for']?.split(',')[0] ||
            req.headers['x-real-ip'] ||
            req.socket.remoteAddress ||
            'Unknown';

        const userAgent = req.headers['user-agent'];
        const { device, browser } = parseUserAgent(userAgent);
        const location = await getLocationFromIP(ip);
        const source = parseReferrer(referrer);

        // Generate or use existing session ID
        const sessionId = clientSessionId || uuidv4();

        // Create visit record
        const visitData = {
            sessionId,
            ip: ip.substring(0, 20) + '...', // Partially hide IP for privacy
            country: location.country,
            city: location.city,
            device,
            browser,
            referrer: source,
            referrerFull: referrer || 'Direct',
            path: path || '/',
            timestamp: new Date(),
            lastSeen: new Date()
        };

        // Store in active sessions for live count
        activeSessions.set(sessionId, {
            ...visitData,
            lastSeen: Date.now()
        });

        // Store in database if connected
        if (db) {
            await db.collection('visits').insertOne(visitData);
        }

        // Send email notification if visitor is from LinkedIn
        if (source === 'LinkedIn') {
            sendLinkedInVisitorNotification(visitData).catch(err => {
                console.error('Email notification failed:', err.message);
            });
        }

        res.json({
            success: true,
            sessionId,
            message: 'Visit tracked'
        });
    } catch (error) {
        console.error('Track visit error:', error);
        res.status(500).json({ success: false, message: 'Failed to track visit' });
    }
};

// Track custom events (like project clicks)
exports.trackEvent = async (req, res) => {
    try {
        const db = getDatabase();
        const { sessionId, eventType, eventData } = req.body;

        if (!sessionId || !eventType) {
            return res.status(400).json({
                success: false,
                message: 'sessionId and eventType are required'
            });
        }

        const eventRecord = {
            sessionId,
            eventType,
            eventData: eventData || {},
            timestamp: new Date()
        };

        if (db) {
            await db.collection('events').insertOne(eventRecord);
        }

        res.json({ success: true, message: 'Event tracked' });
    } catch (error) {
        console.error('Track event error:', error);
        res.status(500).json({ success: false, message: 'Failed to track event' });
    }
};

// Heartbeat to maintain live session
exports.heartbeat = async (req, res) => {
    try {
        const { sessionId } = req.body;

        if (sessionId && activeSessions.has(sessionId)) {
            const session = activeSessions.get(sessionId);
            session.lastSeen = Date.now();
            activeSessions.set(sessionId, session);
        }

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

// Get live viewer count
exports.getLiveCount = async (req, res) => {
    try {
        const now = Date.now();
        let liveCount = 0;

        for (const [, session] of activeSessions) {
            if (now - session.lastSeen < SESSION_TIMEOUT) {
                liveCount++;
            }
        }

        res.json({
            success: true,
            liveCount,
            activeSessions: Array.from(activeSessions.values())
                .filter(s => now - s.lastSeen < SESSION_TIMEOUT)
                .map(s => ({
                    country: s.country,
                    device: s.device,
                    referrer: s.referrer,
                    lastSeen: new Date(s.lastSeen)
                }))
        });
    } catch (error) {
        console.error('Get live count error:', error);
        res.status(500).json({ success: false, message: 'Failed to get live count' });
    }
};

// Get analytics stats (protected)
exports.getStats = async (req, res) => {
    try {
        const db = getDatabase();

        if (!db) {
            return res.json({
                success: true,
                stats: {
                    totalViews: 0,
                    uniqueVisitors: 0,
                    todayViews: 0,
                    last7DaysViews: [],
                    topReferrers: [],
                    topCountries: [],
                    projectClicks: 0
                }
            });
        }

        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        // Initialize with defaults
        let totalViews = 0;
        let uniqueVisitors = 0;
        let todayViews = 0;
        let viewsByDay = [];
        let topReferrers = [];
        let topCountries = [];
        let projectClicks = 0;

        try {
            // Total views
            totalViews = await db.collection('visits').countDocuments({});
        } catch (e) {
            console.error('Error counting total views:', e.message);
        }

        try {
            // Unique visitors (using aggregation instead of distinct for strict API compatibility)
            const uniqueResult = await db.collection('visits').aggregate([
                { $group: { _id: '$sessionId' } },
                { $count: 'total' }
            ]).toArray();
            uniqueVisitors = uniqueResult[0]?.total || 0;
        } catch (e) {
            console.error('Error counting unique visitors:', e.message);
        }

        try {
            // Today's views
            todayViews = await db.collection('visits').countDocuments({
                timestamp: { $gte: todayStart }
            });
        } catch (e) {
            console.error('Error counting today views:', e.message);
        }

        try {
            // Views per day (last 7 days)
            viewsByDay = await db.collection('visits').aggregate([
                { $match: { timestamp: { $gte: sevenDaysAgo } } },
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ]).toArray();
        } catch (e) {
            console.error('Error getting views by day:', e.message);
        }

        try {
            // Top referrers
            topReferrers = await db.collection('visits').aggregate([
                { $group: { _id: '$referrer', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 5 }
            ]).toArray();
        } catch (e) {
            console.error('Error getting top referrers:', e.message);
        }

        try {
            // Top countries
            topCountries = await db.collection('visits').aggregate([
                { $group: { _id: '$country', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 5 }
            ]).toArray();
        } catch (e) {
            console.error('Error getting top countries:', e.message);
        }

        try {
            // Project clicks
            projectClicks = await db.collection('events').countDocuments({
                eventType: 'project_click'
            });
        } catch (e) {
            console.error('Error counting project clicks:', e.message);
        }

        res.json({
            success: true,
            stats: {
                totalViews,
                uniqueVisitors,
                todayViews,
                last7DaysViews: viewsByDay,
                topReferrers,
                topCountries,
                projectClicks
            }
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ success: false, message: 'Failed to get stats' });
    }
};

// Get visitor list (protected, paginated)
exports.getVisitors = async (req, res) => {
    try {
        const db = getDatabase();
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        if (!db) {
            return res.json({
                success: true,
                visitors: [],
                total: 0,
                page,
                totalPages: 0
            });
        }

        const total = await db.collection('visits').countDocuments();
        const visitors = await db.collection('visits')
            .find()
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit)
            .toArray();

        res.json({
            success: true,
            visitors,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error('Get visitors error:', error);
        res.status(500).json({ success: false, message: 'Failed to get visitors' });
    }
};

// Get events list (protected)
exports.getEvents = async (req, res) => {
    try {
        const db = getDatabase();
        const limit = parseInt(req.query.limit) || 50;

        if (!db) {
            return res.json({ success: true, events: [] });
        }

        const events = await db.collection('events')
            .find()
            .sort({ timestamp: -1 })
            .limit(limit)
            .toArray();

        res.json({ success: true, events });
    } catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({ success: false, message: 'Failed to get events' });
    }
};

// Admin login
exports.adminLogin = async (req, res) => {
    try {
        const { password } = req.body;
        const adminSecret = process.env.ADMIN_SECRET;

        if (!adminSecret) {
            return res.status(500).json({
                success: false,
                message: 'Admin not configured'
            });
        }

        if (password === adminSecret) {
            res.json({
                success: true,
                token: adminSecret,
                message: 'Login successful'
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid password'
            });
        }
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ success: false, message: 'Login failed' });
    }
};

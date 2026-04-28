const { getDatabase } = require('../../config/db');
const { v4: uuidv4 } = require('uuid');
const { sendEntryAlertEmail, sendExitReportEmail } = require('../../utils/emailService');

// In-memory store for active sessions (for live count & session history)
const activeSessions = new Map();

// Session timeout (1 minute without heartbeat = inactive)
const SESSION_TIMEOUT = 60000;
const EMAIL_ALERTS_ENABLED = process.env.ANALYTICS_EMAIL_ALERTS === 'true';

let analyticsEnabled = true;
let analyticsAllowDev = process.env.ANALYTICS_ALLOW_DEV === 'true';
let analyticsSettingsLoaded = false;
let analyticsSettingsLoading = null;
let analyticsSettingsUpdatedAt = null;

const loadAnalyticsSettings = async () => {
    const db = getDatabase();
    if (!db) return false;
    if (analyticsSettingsLoaded) return true;
    if (analyticsSettingsLoading) return analyticsSettingsLoading;

    analyticsSettingsLoading = (async () => {
        try {
            const settings = await db.collection('settings').findOne({ key: 'analytics' });
            if (settings) {
                if (typeof settings.enabled === 'boolean') analyticsEnabled = settings.enabled;
                if (typeof settings.allowDev === 'boolean') analyticsAllowDev = settings.allowDev;
                if (settings.updatedAt) analyticsSettingsUpdatedAt = settings.updatedAt;
            }
            analyticsSettingsLoaded = true;
            return true;
        } catch (error) {
            console.error('Failed to load analytics settings:', error.message);
            return false;
        } finally {
            analyticsSettingsLoading = null;
        }
    })();

    return analyticsSettingsLoading;
};

const isLocalIp = (ip) => {
    if (!ip) return false;
    const cleaned = ip.replace('::ffff:', '');
    if (cleaned === '::1' || cleaned === '127.0.0.1') return true;
    if (cleaned.startsWith('192.168.') || cleaned.startsWith('10.')) return true;
    if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(cleaned)) return true;
    return false;
};

const isAdminAnalyticsPath = (path) => {
    if (!path || typeof path !== 'string') return false;
    return path.startsWith('/admin-analytics');
};

const shouldIgnoreAnalytics = (ip) => {
    const allowDev = analyticsAllowDev || process.env.ANALYTICS_ALLOW_DEV === 'true';
    if (allowDev) return false;
    if (process.env.NODE_ENV === 'production') return false;
    return isLocalIp(ip);
};

// ... (helpers remain the same) ...
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

const getLocationFromIP = async (ip) => {
    try {
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

const parseReferrer = (referrer) => {
    if (!referrer) return 'Direct';

    const url = referrer.toLowerCase();
    if (url.includes('linkedin.com') || url.includes('linkedin.android') || url.includes('com.linkedin')) {
        return 'LinkedIn';
    }
    if (url.includes('google.com')) return 'Google';
    if (url.includes('github.com')) return 'GitHub';
    if (url.includes('twitter.com') || url.includes('x.com')) return 'Twitter/X';
    if (url.includes('facebook.com')) return 'Facebook';
    if (url.includes('instagram.com')) return 'Instagram';

    try {
        const domain = new URL(referrer).hostname.replace('www.', '');
        return domain;
    } catch {
        return 'Other';
    }
};

// Clean up inactive sessions periodically & Send Exit Reports
setInterval(() => {
    const now = Date.now();
    for (const [sessionId, session] of activeSessions) {
        if (now - session.lastSeen > SESSION_TIMEOUT) {
            // Session expired - check if we should send Exit Report
            const durationSeconds = (session.lastSeen - new Date(session.timestamp).getTime()) / 1000;
            const source = session.referrer;
            const isAdminSession = isAdminAnalyticsPath(session.path) || (session.pages || []).some((p) => isAdminAnalyticsPath(p.path));

            // Criteria for Exit Report: From LinkedIn OR High Engagement (> 2 mins or > 3 pages)
            const shouldSendExitReport =
                source === 'LinkedIn' ||
                durationSeconds > 120 ||
                (session.pages && session.pages.length > 3);

            if (EMAIL_ALERTS_ENABLED && !isAdminSession && shouldSendExitReport) {
                console.log(`📊 Generating Exit Report for session ${sessionId} (${source})`);
                sendExitReportEmail({
                    ...session,
                    duration: durationSeconds
                }).catch(err => console.error('Exit report failed:', err));
            }

            activeSessions.delete(sessionId);
        }
    }
}, 30000);

// Track a new visit (ENTRY)
exports.trackVisit = async (req, res) => {
    try {
        await loadAnalyticsSettings();
        const db = getDatabase();
        const { sessionId: clientSessionId, path, referrer } = req.body;

        const ip = req.headers['x-forwarded-for']?.split(',')[0] ||
            req.headers['x-real-ip'] ||
            req.socket.remoteAddress || 'Unknown';

        const userAgent = req.headers['user-agent'];
        const { device, browser } = parseUserAgent(userAgent);
        const location = await getLocationFromIP(ip);
        const source = parseReferrer(referrer);
        const sessionId = clientSessionId || uuidv4();
        const isAdminPath = isAdminAnalyticsPath(path);

        if (!analyticsEnabled) {
            return res.json({ success: true, sessionId, ignored: true, message: 'Analytics paused' });
        }

        if (shouldIgnoreAnalytics(ip)) {
            return res.json({ success: true, sessionId, ignored: true, message: 'Visit ignored in dev' });
        }

        const visitData = {
            sessionId,
            ip: ip.substring(0, 20) + '...',
            country: location.country,
            city: location.city,
            device,
            browser,
            referrer: source,
            referrerFull: referrer || 'Direct',
            path: path || '/',
            timestamp: new Date(),
            lastSeen: new Date(),
            // Initialize history
            pages: [{ path: path || '/', time: new Date() }],
            events: []
        };

        // If session already exists, just update it (don't reset history)
        if (activeSessions.has(sessionId)) {
            const existing = activeSessions.get(sessionId);
            existing.lastSeen = Date.now();
            // Don't duplicate page view if it's the same
            const lastPage = existing.pages[existing.pages.length - 1];
            if (lastPage.path !== (path || '/')) {
                existing.pages.push({ path: path || '/', time: new Date() });
            }
            activeSessions.set(sessionId, existing);
        } else {
            // New Session - Send Entry Alert
            activeSessions.set(sessionId, { ...visitData, lastSeen: Date.now() });

            // Store in DB
            if (db) await db.collection('visits').insertOne(visitData);

            // Send Entry Alert for LinkedIn
            if (EMAIL_ALERTS_ENABLED && !isAdminPath && source === 'LinkedIn') {
                console.log(`🔔 New LinkedIn visitor! Sending Entry Alert...`);
                sendEntryAlertEmail(visitData).catch(err => console.error('Entry alert failed:', err));
            }
        }

        res.json({ success: true, sessionId, message: 'Visit tracked' });
    } catch (error) {
        console.error('Track visit error:', error);
        res.status(500).json({ success: false, message: 'Failed to track visit' });
    }
};

// Track custom events & Page Views
exports.trackEvent = async (req, res) => {
    try {
        await loadAnalyticsSettings();
        const db = getDatabase();
        const { sessionId, eventType, eventData } = req.body;

        const ip = req.headers['x-forwarded-for']?.split(',')[0] ||
            req.headers['x-real-ip'] ||
            req.socket.remoteAddress || 'Unknown';

        if (!analyticsEnabled) {
            return res.json({ success: true, ignored: true, message: 'Analytics paused' });
        }

        if (shouldIgnoreAnalytics(ip)) {
            return res.json({ success: true, ignored: true, message: 'Event ignored in dev' });
        }

        if (!sessionId || !eventType) {
            return res.status(400).json({ success: false, message: 'Missing args' });
        }

        // Update active session history
        if (activeSessions.has(sessionId)) {
            const session = activeSessions.get(sessionId);
            session.lastSeen = Date.now();

            if (eventType === 'page_view') {
                const path = eventData?.path;
                // Avoid adjacent duplicates
                const lastPage = session.pages[session.pages.length - 1];
                if (path && (!lastPage || lastPage.path !== path)) {
                    session.pages.push({ path, time: new Date() });
                }
            } else {
                session.events.push({ type: eventType, data: eventData, time: new Date() });
            }
            activeSessions.set(sessionId, session);
        }

        const eventRecord = {
            sessionId,
            eventType,
            eventData: eventData || {},
            timestamp: new Date()
        };

        if (db) await db.collection('events').insertOne(eventRecord);

        res.json({ success: true, message: 'Event tracked' });
    } catch (error) {
        console.error('Track event error:', error);
        res.status(500).json({ success: false, message: 'Failed to track event' });
    }
};

// Heartbeat to maintain live session
exports.heartbeat = async (req, res) => {
    try {
        await loadAnalyticsSettings();
        const { sessionId } = req.body;

        const ip = req.headers['x-forwarded-for']?.split(',')[0] ||
            req.headers['x-real-ip'] ||
            req.socket.remoteAddress || 'Unknown';

        if (!analyticsEnabled) {
            return res.json({ success: true, ignored: true });
        }

        if (shouldIgnoreAnalytics(ip)) {
            return res.json({ success: true, ignored: true });
        }

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

// Get extended analytics stats (device/browser distribution, hourly patterns, etc.)
exports.getExtendedStats = async (req, res) => {
    try {
        const db = getDatabase();

        if (!db) {
            return res.json({
                success: true,
                extendedStats: {
                    deviceDistribution: [],
                    browserDistribution: [],
                    hourlyTraffic: [],
                    topCities: [],
                    last30DaysViews: [],
                    weeklyComparison: { current: 0, previous: 0, change: 0 }
                }
            });
        }

        const now = new Date();
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        let deviceDistribution = [];
        let browserDistribution = [];
        let hourlyTraffic = [];
        let topCities = [];
        let last30DaysViews = [];
        let currentWeekViews = 0;
        let previousWeekViews = 0;

        try {
            // Device distribution
            deviceDistribution = await db.collection('visits').aggregate([
                { $group: { _id: '$device', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]).toArray();
        } catch (e) {
            console.error('Error getting device distribution:', e.message);
        }

        try {
            // Browser distribution
            browserDistribution = await db.collection('visits').aggregate([
                { $group: { _id: '$browser', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 6 }
            ]).toArray();
        } catch (e) {
            console.error('Error getting browser distribution:', e.message);
        }

        try {
            // Hourly traffic pattern (last 7 days)
            hourlyTraffic = await db.collection('visits').aggregate([
                { $match: { timestamp: { $gte: sevenDaysAgo } } },
                {
                    $group: {
                        _id: { $hour: '$timestamp' },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ]).toArray();
        } catch (e) {
            console.error('Error getting hourly traffic:', e.message);
        }

        try {
            // Top cities
            topCities = await db.collection('visits').aggregate([
                { $group: { _id: '$city', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 5 }
            ]).toArray();
        } catch (e) {
            console.error('Error getting top cities:', e.message);
        }

        try {
            // Last 30 days views
            last30DaysViews = await db.collection('visits').aggregate([
                { $match: { timestamp: { $gte: thirtyDaysAgo } } },
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ]).toArray();
        } catch (e) {
            console.error('Error getting last 30 days views:', e.message);
        }

        try {
            // Weekly comparison
            currentWeekViews = await db.collection('visits').countDocuments({
                timestamp: { $gte: sevenDaysAgo }
            });
            previousWeekViews = await db.collection('visits').countDocuments({
                timestamp: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo }
            });
        } catch (e) {
            console.error('Error getting weekly comparison:', e.message);
        }

        const weeklyChange = previousWeekViews > 0
            ? Math.round(((currentWeekViews - previousWeekViews) / previousWeekViews) * 100)
            : 0;

        res.json({
            success: true,
            extendedStats: {
                deviceDistribution,
                browserDistribution,
                hourlyTraffic,
                topCities,
                last30DaysViews,
                weeklyComparison: {
                    current: currentWeekViews,
                    previous: previousWeekViews,
                    change: weeklyChange
                }
            }
        });
    } catch (error) {
        console.error('Get extended stats error:', error);
        res.status(500).json({ success: false, message: 'Failed to get extended stats' });
    }
};

// Get top projects (most clicked)
exports.getTopProjects = async (req, res) => {
    try {
        const db = getDatabase();

        if (!db) {
            return res.json({ success: true, topProjects: [] });
        }

        const topProjects = await db.collection('events').aggregate([
            { $match: { eventType: 'project_click' } },
            { $group: { _id: '$eventData.projectName', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]).toArray();

        res.json({ success: true, topProjects });
    } catch (error) {
        console.error('Get top projects error:', error);
        res.status(500).json({ success: false, message: 'Failed to get top projects' });
    }
};

// Clear all analytics data (admin only)
exports.clearAllData = async (req, res) => {
    try {
        const db = getDatabase();

        if (!db) {
            return res.status(503).json({ success: false, message: 'Database not connected' });
        }

        // Clear visits collection
        const analyticsResult = await db.collection('visits').deleteMany({});

        // Clear events collection
        const eventsResult = await db.collection('events').deleteMany({});

        // Clear contacts collection
        const contactsResult = await db.collection('contacts').deleteMany({});

        // Clear in-memory sessions
        activeSessions.clear();

        console.log(`🗑️ Cleared all data:`);
        console.log(`   - ${analyticsResult.deletedCount} visitor records`);
        console.log(`   - ${eventsResult.deletedCount} event records`);
        console.log(`   - ${contactsResult.deletedCount} contact messages`);

        res.json({
            success: true,
            message: 'All analytics data cleared',
            deleted: {
                visitors: analyticsResult.deletedCount,
                events: eventsResult.deletedCount,
                contacts: contactsResult.deletedCount
            }
        });
    } catch (error) {
        console.error('Clear all data error:', error);
        res.status(500).json({ success: false, message: 'Failed to clear data' });
    }
};

exports.getAnalyticsStatus = (req, res) => {
    loadAnalyticsSettings()
        .then(() => res.json({
            success: true,
            enabled: analyticsEnabled,
            allowDev: analyticsAllowDev,
            updatedAt: analyticsSettingsUpdatedAt
        }))
        .catch(() => res.json({
            success: true,
            enabled: analyticsEnabled,
            allowDev: analyticsAllowDev,
            updatedAt: analyticsSettingsUpdatedAt
        }));
};

exports.getAnalyticsPublicConfig = (req, res) => {
    loadAnalyticsSettings()
        .then(() => res.json({
            success: true,
            enabled: analyticsEnabled,
            allowDev: analyticsAllowDev
        }))
        .catch(() => res.json({
            success: true,
            enabled: analyticsEnabled,
            allowDev: analyticsAllowDev
        }));
};

exports.setAnalyticsStatus = (req, res) => {
    const { enabled, allowDev } = req.body || {};
    if (typeof enabled === 'undefined' && typeof allowDev === 'undefined') {
        return res.status(400).json({ success: false, message: 'Missing enabled/allowDev flag' });
    }

    if (typeof enabled !== 'undefined') {
        const normalized = typeof enabled === 'string' ? enabled.toLowerCase() === 'true' : Boolean(enabled);
        analyticsEnabled = normalized;
    }

    if (typeof allowDev !== 'undefined') {
        const normalizedDev = typeof allowDev === 'string' ? allowDev.toLowerCase() === 'true' : Boolean(allowDev);
        analyticsAllowDev = normalizedDev;
    }

    const db = getDatabase();
    if (!db) {
        return res.json({ success: true, enabled: analyticsEnabled, allowDev: analyticsAllowDev });
    }

    db.collection('settings')
        .updateOne(
            { key: 'analytics' },
            {
                $set: {
                    enabled: analyticsEnabled,
                    allowDev: analyticsAllowDev,
                    updatedAt: new Date()
                }
            },
            { upsert: true }
        )
        .then((result) => {
            analyticsSettingsUpdatedAt = new Date();
            res.json({
                success: true,
                enabled: analyticsEnabled,
                allowDev: analyticsAllowDev,
                updatedAt: analyticsSettingsUpdatedAt
            });
        })
        .catch((error) => {
            console.error('Failed to persist analytics settings:', error.message);
            res.json({
                success: true,
                enabled: analyticsEnabled,
                allowDev: analyticsAllowDev,
                updatedAt: analyticsSettingsUpdatedAt
            });
        });
};

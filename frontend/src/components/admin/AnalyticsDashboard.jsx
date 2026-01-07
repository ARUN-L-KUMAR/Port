import React, { useState, useEffect, useCallback } from 'react';
import emailjs from '@emailjs/browser';
import './AnalyticsDashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AnalyticsDashboard = ({ token, onLogout }) => {
    const [stats, setStats] = useState({
        totalViews: 0,
        uniqueVisitors: 0,
        todayViews: 0,
        projectClicks: 0,
        topReferrers: [],
        topCountries: [],
        last7DaysViews: []
    });
    const [extendedStats, setExtendedStats] = useState({
        deviceDistribution: [],
        browserDistribution: [],
        hourlyTraffic: [],
        topCities: [],
        last30DaysViews: [],
        weeklyComparison: { current: 0, previous: 0, change: 0 }
    });
    const [topProjects, setTopProjects] = useState([]);
    const [visitors, setVisitors] = useState([]);
    const [events, setEvents] = useState([]);
    const [messages, setMessages] = useState([]);
    const [liveData, setLiveData] = useState({ liveCount: 0, activeSessions: [] });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalVisitors, setTotalVisitors] = useState(0);

    // Reply Modal State
    const [replyModalOpen, setReplyModalOpen] = useState(false);
    const [replyData, setReplyData] = useState({ to: '', subject: '', message: '', id: null, name: '' });
    const [isSendingReply, setIsSendingReply] = useState(false);

    const fetchWithAuth = useCallback(async (endpoint) => {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            return { success: false };
        }
    }, [token]);

    const fetchData = useCallback(async () => {
        try {
            const [statsData, extendedData, projectsData, visitorsData, eventsData, liveDataRes, messagesData] = await Promise.all([
                fetchWithAuth('/api/analytics/stats'),
                fetchWithAuth('/api/analytics/extended-stats'),
                fetchWithAuth('/api/analytics/top-projects'),
                fetchWithAuth(`/api/analytics/visitors?page=${page}&limit=15`),
                fetchWithAuth('/api/analytics/events?limit=30'),
                fetchWithAuth('/api/analytics/live'),
                fetchWithAuth('/api/contacts')
            ]);

            if (statsData.success && statsData.stats) {
                setStats(statsData.stats);
            }
            if (extendedData.success && extendedData.extendedStats) {
                setExtendedStats(extendedData.extendedStats);
            }
            if (projectsData.success) {
                setTopProjects(projectsData.topProjects || []);
            }
            if (visitorsData.success) {
                setVisitors(visitorsData.visitors || []);
                setTotalPages(visitorsData.totalPages || 1);
                setTotalVisitors(visitorsData.total || 0);
            }
            if (eventsData.success) {
                setEvents(eventsData.events || []);
            }
            if (liveDataRes.success) {
                setLiveData(liveDataRes);
            }
            if (messagesData.success) {
                setMessages(messagesData.contacts || []);
            }
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    }, [fetchWithAuth, page]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const liveDataRes = await fetchWithAuth('/api/analytics/live');
                if (liveDataRes.success) setLiveData(liveDataRes);
            } catch (error) { }
        }, 5000);
        return () => clearInterval(interval);
    }, [fetchWithAuth]);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatFullDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleString('en-IN', {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getDeviceIcon = (device) => {
        switch (device) {
            case 'Mobile': return '📱';
            case 'Tablet': return '📲';
            default: return '💻';
        }
    };

    const getReferrerIcon = (referrer) => {
        switch (referrer) {
            case 'LinkedIn': return '💼';
            case 'Google': return '🔍';
            case 'GitHub': return '🐙';
            case 'Twitter/X': return '🐦';
            case 'Direct': return '🔗';
            default: return '🌐';
        }
    };

    const getBrowserIcon = (browser) => {
        switch (browser) {
            case 'Chrome': return '🌐';
            case 'Safari': return '🧭';
            case 'Firefox': return '🦊';
            case 'Edge': return '🔷';
            default: return '🌐';
        }
    };

    const getBrowserColor = (browser) => {
        const colors = {
            'Chrome': '#4285f4',
            'Safari': '#00aaff',
            'Firefox': '#ff7139',
            'Edge': '#0078d7',
            'Opera': '#ff1b2d',
            'Unknown': '#888'
        };
        return colors[browser] || '#00ff88';
    };

    const getCountryFlag = (country) => {
        const flags = {
            'India': '🇮🇳',
            'United States': '🇺🇸',
            'United Kingdom': '🇬🇧',
            'Germany': '🇩🇪',
            'Canada': '🇨🇦',
            'Australia': '🇦🇺',
            'Local': '🏠'
        };
        return flags[country] || '🌍';
    };

    const generateInsights = () => {
        const insights = [];

        if (extendedStats.weeklyComparison) {
            const { change, current, previous } = extendedStats.weeklyComparison;
            if (change > 0) {
                insights.push({ icon: '📈', text: `Traffic increased ${change}% compared to last week (${current} vs ${previous} views)`, type: 'positive' });
            } else if (change < 0) {
                insights.push({ icon: '📉', text: `Traffic decreased ${Math.abs(change)}% compared to last week`, type: 'negative' });
            } else if (current > 0) {
                insights.push({ icon: '➡️', text: `Traffic is stable compared to last week`, type: 'info' });
            }
        }

        if (stats.topReferrers && stats.topReferrers.length > 0) {
            const topRef = stats.topReferrers[0];
            const percentage = stats.totalViews > 0 ? Math.round((topRef.count / stats.totalViews) * 100) : 0;
            insights.push({ icon: getReferrerIcon(topRef._id), text: `${topRef._id} is your top traffic source (${percentage}% of visitors)`, type: 'info' });
        }

        if (extendedStats.deviceDistribution && extendedStats.deviceDistribution.length > 0) {
            const total = extendedStats.deviceDistribution.reduce((sum, d) => sum + d.count, 0);
            const mobile = extendedStats.deviceDistribution.find(d => d._id === 'Mobile');
            const desktop = extendedStats.deviceDistribution.find(d => d._id === 'Desktop');
            if (mobile && total > 0) {
                const mobilePercentage = Math.round((mobile.count / total) * 100);
                insights.push({ icon: '📱', text: `${mobilePercentage}% of visitors browse from mobile devices`, type: 'info' });
            }
            if (desktop && total > 0) {
                const desktopPercentage = Math.round((desktop.count / total) * 100);
                insights.push({ icon: '💻', text: `${desktopPercentage}% of visitors use desktop computers`, type: 'info' });
            }
        }

        if (stats.topCountries && stats.topCountries.length > 0) {
            const topCountry = stats.topCountries[0];
            const percentage = stats.totalViews > 0 ? Math.round((topCountry.count / stats.totalViews) * 100) : 0;
            insights.push({ icon: getCountryFlag(topCountry._id), text: `${topCountry._id} accounts for ${percentage}% of your traffic`, type: 'info' });
        }

        if (topProjects && topProjects.length > 0) {
            insights.push({ icon: '⚡', text: `"${topProjects[0]._id}" is your most clicked project (${topProjects[0].count} clicks)`, type: 'info' });
        }

        if (extendedStats.hourlyTraffic && extendedStats.hourlyTraffic.length > 0) {
            const sorted = [...extendedStats.hourlyTraffic].sort((a, b) => b.count - a.count);
            if (sorted.length > 0) {
                const peakHour = sorted[0]._id;
                const formattedHour = peakHour >= 12 ? `${peakHour === 12 ? 12 : peakHour - 12} PM` : `${peakHour === 0 ? 12 : peakHour} AM`;
                insights.push({ icon: '🕐', text: `Peak traffic hour: ${formattedHour}`, type: 'info' });
            }
        }

        return insights;
        return insights;
    };

    const handleMarkAsRead = async (id, e) => {
        e.stopPropagation();
        try {
            const response = await fetch(`${API_URL}/api/contacts/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 'read' })
            });

            if (response.ok) {
                setMessages(prev => prev.map(msg => msg._id === id ? { ...msg, status: 'read' } : msg));
            }
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const handleReply = (msg) => {
        setReplyData({
            to: msg.email,
            subject: `Re: ${msg.subject}`,
            message: '',
            name: msg.name,
            id: msg._id
        });
        setReplyModalOpen(true);
    };

    const closeReplyModal = () => {
        setReplyModalOpen(false);
        setReplyData({ to: '', subject: '', message: '', id: null, name: '' });
    };

    const sendReply = async (e) => {
        e.preventDefault();
        setIsSendingReply(true);

        const EMAILJS_SERVICE_ID = 'service_ouq955n';
        const EMAILJS_TEMPLATE_ID = 'template_wnm75bf';
        const EMAILJS_PUBLIC_KEY = 'N7fgACS-m8PSrnVJo';

        try {
            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                {
                    to_name: replyData.name,
                    email: replyData.to,
                    from_name: 'Arun L. Kumar',
                    subject: replyData.subject,
                    message: replyData.message,
                    reply_to: 'arunkumar582004@gmail.com'
                },
                EMAILJS_PUBLIC_KEY
            );

            // Update status to replied
            await fetch(`${API_URL}/api/contacts/${replyData.id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 'replied' })
            });

            setMessages(prev => prev.map(msg => msg._id === replyData.id ? { ...msg, status: 'replied' } : msg));
            closeReplyModal();
            alert('Reply sent successfully!');
        } catch (error) {
            console.error('Failed to send reply:', error);
            alert('Failed to send reply. Please try again.');
        } finally {
            setIsSendingReply(false);
        }
    };

    const calculateDonutData = (data, total) => {
        if (!data || data.length === 0 || total === 0) return [];
        const colors = ['#00ff88', '#00aaff', '#ff6b6b', '#ffd93d', '#6c5ce7', '#a29bfe'];
        let startAngle = 0;

        return data.map((item, index) => {
            const percentage = (item.count / total) * 100;
            const angle = (percentage / 100) * 360;
            const segment = {
                ...item,
                percentage: Math.round(percentage),
                startAngle,
                endAngle: startAngle + angle,
                color: colors[index % colors.length]
            };
            startAngle += angle;
            return segment;
        });
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>
                <p>Loading Analytics...</p>
            </div>
        );
    }

    const totalDevices = extendedStats.deviceDistribution?.reduce((sum, d) => sum + d.count, 0) || 0;
    const totalReferrers = stats.topReferrers?.reduce((sum, r) => sum + r.count, 0) || 0;
    const deviceDonutData = calculateDonutData(extendedStats.deviceDistribution, totalDevices);
    const referrerDonutData = calculateDonutData(stats.topReferrers, totalReferrers);
    const insights = generateInsights();
    const avgDailyViews = extendedStats.weeklyComparison?.current ? Math.round(extendedStats.weeklyComparison.current / 7) : 0;

    return (
        <div className="analytics-dashboard">
            {/* Header */}
            <header className="dashboard-header">
                <div className="header-left">
                    <h1>📊 Portfolio Analytics</h1>
                    <span className="live-badge">
                        <span className="live-dot"></span>
                        {liveData.liveCount} Live
                    </span>
                </div>
                <div className="header-right">
                    <span className="last-updated">Last updated: {new Date().toLocaleTimeString()}</span>
                    <button className="logout-btn" onClick={onLogout}>
                        Logout 🚪
                    </button>
                </div>
            </header>

            {/* Stats Cards - Always Visible */}
            <div className="stats-grid">
                <div className="stat-card primary">
                    <div className="stat-icon">👁️</div>
                    <div className="stat-content">
                        <span className="stat-value">{stats.totalViews || 0}</span>
                        <span className="stat-label">Total Views</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">👤</div>
                    <div className="stat-content">
                        <span className="stat-value">{stats.uniqueVisitors || 0}</span>
                        <span className="stat-label">Unique Visitors</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📅</div>
                    <div className="stat-content">
                        <span className="stat-value">{stats.todayViews || 0}</span>
                        <span className="stat-label">Today's Views</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">⚡</div>
                    <div className="stat-content">
                        <span className="stat-value">{stats.projectClicks || 0}</span>
                        <span className="stat-label">Project Clicks</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <div className="stat-content">
                        <span className="stat-value">{avgDailyViews}</span>
                        <span className="stat-label">Avg Daily Views</span>
                    </div>
                </div>
                <div className="stat-card trend-card">
                    <div className="stat-icon">{extendedStats.weeklyComparison?.change >= 0 ? '📈' : '📉'}</div>
                    <div className="stat-content">
                        <span className={`stat-value ${extendedStats.weeklyComparison?.change >= 0 ? 'positive' : 'negative'}`}>
                            {extendedStats.weeklyComparison?.change >= 0 ? '+' : ''}{extendedStats.weeklyComparison?.change || 0}%
                        </span>
                        <span className="stat-label">Weekly Change</span>
                    </div>
                </div>
            </div>

            {/* Live Viewers Section */}
            {liveData.liveCount > 0 && (
                <div className="live-section">
                    <h2>🟢 Currently Viewing ({liveData.liveCount})</h2>
                    <div className="live-viewers">
                        {liveData.activeSessions.map((session, idx) => (
                            <div key={idx} className="live-viewer-card">
                                <span>{getDeviceIcon(session.device)}</span>
                                <span>{getCountryFlag(session.country)} {session.country}</span>
                                <span className="referrer-badge">{getReferrerIcon(session.referrer)} {session.referrer}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="tabs">
                <button className={`tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
                    📋 Overview
                </button>
                <button className={`tab ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
                    📊 Analytics
                </button>
                <button className={`tab ${activeTab === 'visitors' ? 'active' : ''}`} onClick={() => setActiveTab('visitors')}>
                    👥 Visitors
                </button>
                <button className={`tab ${activeTab === 'clicks' ? 'active' : ''}`} onClick={() => setActiveTab('clicks')}>
                    🖱️ Clicks
                </button>
                <button className={`tab ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveTab('messages')}>
                    📬 Messages {messages.filter(m => (m.status || 'new') === 'new').length > 0 && <span className="tab-badge">{messages.filter(m => (m.status || 'new') === 'new').length}</span>}
                </button>
                <button className={`tab ${activeTab === 'insights' ? 'active' : ''}`} onClick={() => setActiveTab('insights')}>
                    💡 Insights
                </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
                {activeTab === 'overview' && (
                    <div className="overview-section">
                        {/* Quick Stats Row */}
                        <div className="quick-stats-row">
                            <div className="quick-stat">
                                <span className="quick-stat-icon">📈</span>
                                <div className="quick-stat-content">
                                    <span className="quick-stat-value">{extendedStats.weeklyComparison?.current || 0}</span>
                                    <span className="quick-stat-label">This Week</span>
                                </div>
                            </div>
                            <div className="quick-stat">
                                <span className="quick-stat-icon">📉</span>
                                <div className="quick-stat-content">
                                    <span className="quick-stat-value">{extendedStats.weeklyComparison?.previous || 0}</span>
                                    <span className="quick-stat-label">Last Week</span>
                                </div>
                            </div>
                            <div className="quick-stat">
                                <span className="quick-stat-icon">🔄</span>
                                <div className="quick-stat-content">
                                    <span className="quick-stat-value">{totalVisitors}</span>
                                    <span className="quick-stat-label">Total Records</span>
                                </div>
                            </div>
                            <div className="quick-stat">
                                <span className="quick-stat-icon">🎯</span>
                                <div className="quick-stat-content">
                                    <span className="quick-stat-value">{events.length}</span>
                                    <span className="quick-stat-label">Recent Events</span>
                                </div>
                            </div>
                        </div>

                        <div className="overview-grid">
                            {/* Top Referrers */}
                            <div className="data-card">
                                <h3>🔗 Top Traffic Sources</h3>
                                <div className="bar-chart">
                                    {stats.topReferrers && stats.topReferrers.length > 0 ? (
                                        stats.topReferrers.map((ref, idx) => (
                                            <div key={idx} className="bar-item">
                                                <div className="bar-label">
                                                    {getReferrerIcon(ref._id)} {ref._id}
                                                </div>
                                                <div className="bar-container">
                                                    <div
                                                        className="bar"
                                                        style={{
                                                            width: `${(ref.count / (stats.topReferrers[0]?.count || 1)) * 100}%`
                                                        }}
                                                    ></div>
                                                    <span className="bar-value">{ref.count}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="no-data">No referrer data yet</p>
                                    )}
                                </div>
                            </div>

                            {/* Top Countries */}
                            <div className="data-card">
                                <h3>🌍 Geographic Distribution</h3>
                                <div className="bar-chart">
                                    {stats.topCountries && stats.topCountries.length > 0 ? (
                                        stats.topCountries.map((country, idx) => (
                                            <div key={idx} className="bar-item">
                                                <div className="bar-label">
                                                    {getCountryFlag(country._id)} {country._id}
                                                </div>
                                                <div className="bar-container">
                                                    <div
                                                        className="bar country-bar"
                                                        style={{
                                                            width: `${(country.count / (stats.topCountries[0]?.count || 1)) * 100}%`
                                                        }}
                                                    ></div>
                                                    <span className="bar-value">{country.count}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="no-data">No country data yet</p>
                                    )}
                                </div>
                            </div>

                            {/* Device Quick View */}
                            <div className="data-card">
                                <h3>📱 Device Breakdown</h3>
                                <div className="device-breakdown">
                                    {extendedStats.deviceDistribution && extendedStats.deviceDistribution.length > 0 ? (
                                        extendedStats.deviceDistribution.map((device, idx) => {
                                            const percentage = totalDevices > 0 ? Math.round((device.count / totalDevices) * 100) : 0;
                                            return (
                                                <div key={idx} className="device-item">
                                                    <div className="device-info">
                                                        <span className="device-icon">{getDeviceIcon(device._id)}</span>
                                                        <span className="device-name">{device._id}</span>
                                                    </div>
                                                    <div className="device-stats">
                                                        <span className="device-count">{device.count}</span>
                                                        <span className="device-percentage">{percentage}%</span>
                                                    </div>
                                                    <div className="device-bar-bg">
                                                        <div className="device-bar-fill" style={{ width: `${percentage}%` }}></div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="no-data">No device data yet</p>
                                    )}
                                </div>
                            </div>

                            {/* Browser Quick View */}
                            <div className="data-card">
                                <h3>🌐 Browser Usage</h3>
                                <div className="browser-breakdown">
                                    {extendedStats.browserDistribution && extendedStats.browserDistribution.length > 0 ? (
                                        extendedStats.browserDistribution.slice(0, 5).map((browser, idx) => {
                                            const total = extendedStats.browserDistribution.reduce((sum, b) => sum + b.count, 0);
                                            const percentage = total > 0 ? Math.round((browser.count / total) * 100) : 0;
                                            return (
                                                <div key={idx} className="browser-item-small">
                                                    <span className="browser-icon">{getBrowserIcon(browser._id)}</span>
                                                    <span className="browser-name">{browser._id}</span>
                                                    <span className="browser-stat" style={{ color: getBrowserColor(browser._id) }}>{percentage}%</span>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="no-data">No browser data yet</p>
                                    )}
                                </div>
                            </div>

                            {/* Views Chart (Last 7 days) */}
                            <div className="data-card wide">
                                <h3>📈 Views Trend (Last 7 Days)</h3>
                                <div className="simple-chart">
                                    {stats.last7DaysViews && stats.last7DaysViews.length > 0 ? (
                                        stats.last7DaysViews.map((day, idx) => {
                                            const maxCount = Math.max(...stats.last7DaysViews.map(d => d.count)) || 1;
                                            return (
                                                <div key={idx} className="chart-bar-container">
                                                    <div
                                                        className="chart-bar"
                                                        style={{
                                                            height: `${(day.count / maxCount) * 100}%`
                                                        }}
                                                    >
                                                        <span className="chart-value">{day.count}</span>
                                                    </div>
                                                    <span className="chart-label">{day._id.slice(5)}</span>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="no-data">No data available for the last 7 days</p>
                                    )}
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="data-card wide">
                                <h3>🕐 Recent Activity</h3>
                                <div className="recent-activity">
                                    {visitors.slice(0, 5).length > 0 ? (
                                        visitors.slice(0, 5).map((visitor, idx) => (
                                            <div key={idx} className="activity-item">
                                                <div className="activity-icon">{getDeviceIcon(visitor.device)}</div>
                                                <div className="activity-details">
                                                    <span className="activity-location">{getCountryFlag(visitor.country)} {visitor.city}, {visitor.country}</span>
                                                    <span className="activity-source">{getReferrerIcon(visitor.referrer)} via {visitor.referrer}</span>
                                                </div>
                                                <div className="activity-time">{formatDate(visitor.timestamp)}</div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="no-data">No recent activity</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div className="analytics-grid">
                        {/* Device Distribution Donut */}
                        <div className="data-card">
                            <h3>📱 Device Distribution</h3>
                            <div className="donut-chart-container">
                                {totalDevices > 0 ? (
                                    <>
                                        <svg className="donut-chart" viewBox="0 0 100 100">
                                            {deviceDonutData.map((segment, idx) => {
                                                const radius = 40;
                                                const circumference = 2 * Math.PI * radius;
                                                const strokeDasharray = `${(segment.percentage / 100) * circumference} ${circumference}`;
                                                const rotation = (segment.startAngle - 90);

                                                return (
                                                    <circle
                                                        key={idx}
                                                        cx="50"
                                                        cy="50"
                                                        r={radius}
                                                        fill="none"
                                                        stroke={segment.color}
                                                        strokeWidth="15"
                                                        strokeDasharray={strokeDasharray}
                                                        transform={`rotate(${rotation} 50 50)`}
                                                        className="donut-segment"
                                                    />
                                                );
                                            })}
                                            <text x="50" y="50" textAnchor="middle" dy="0.35em" className="donut-center-text">
                                                {totalDevices}
                                            </text>
                                        </svg>
                                        <div className="donut-legend">
                                            {deviceDonutData.map((segment, idx) => (
                                                <div key={idx} className="legend-item">
                                                    <span className="legend-color" style={{ background: segment.color }}></span>
                                                    <span className="legend-label">{getDeviceIcon(segment._id)} {segment._id}</span>
                                                    <span className="legend-value">{segment.percentage}%</span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <p className="no-data">No device data yet</p>
                                )}
                            </div>
                        </div>

                        {/* Traffic Sources Donut */}
                        <div className="data-card">
                            <h3>🔗 Traffic Sources</h3>
                            <div className="donut-chart-container">
                                {totalReferrers > 0 ? (
                                    <>
                                        <svg className="donut-chart" viewBox="0 0 100 100">
                                            {referrerDonutData.map((segment, idx) => {
                                                const radius = 40;
                                                const circumference = 2 * Math.PI * radius;
                                                const strokeDasharray = `${(segment.percentage / 100) * circumference} ${circumference}`;
                                                const rotation = (segment.startAngle - 90);

                                                return (
                                                    <circle
                                                        key={idx}
                                                        cx="50"
                                                        cy="50"
                                                        r={radius}
                                                        fill="none"
                                                        stroke={segment.color}
                                                        strokeWidth="15"
                                                        strokeDasharray={strokeDasharray}
                                                        transform={`rotate(${rotation} 50 50)`}
                                                        className="donut-segment"
                                                    />
                                                );
                                            })}
                                            <text x="50" y="50" textAnchor="middle" dy="0.35em" className="donut-center-text">
                                                {totalReferrers}
                                            </text>
                                        </svg>
                                        <div className="donut-legend">
                                            {referrerDonutData.map((segment, idx) => (
                                                <div key={idx} className="legend-item">
                                                    <span className="legend-color" style={{ background: segment.color }}></span>
                                                    <span className="legend-label">{getReferrerIcon(segment._id)} {segment._id}</span>
                                                    <span className="legend-value">{segment.percentage}%</span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <p className="no-data">No referrer data yet</p>
                                )}
                            </div>
                        </div>

                        {/* Browser Distribution */}
                        <div className="data-card">
                            <h3>🌐 Browser Distribution</h3>
                            <div className="browser-chart">
                                {extendedStats.browserDistribution && extendedStats.browserDistribution.length > 0 ? (
                                    extendedStats.browserDistribution.map((browser, idx) => {
                                        const total = extendedStats.browserDistribution.reduce((sum, b) => sum + b.count, 0);
                                        const percentage = total > 0 ? Math.round((browser.count / total) * 100) : 0;
                                        return (
                                            <div key={idx} className="browser-item">
                                                <div className="browser-label">
                                                    <span className="browser-name">{getBrowserIcon(browser._id)} {browser._id}</span>
                                                    <span className="browser-percentage">{percentage}%</span>
                                                </div>
                                                <div className="browser-bar-container">
                                                    <div
                                                        className="browser-bar"
                                                        style={{
                                                            width: `${percentage}%`,
                                                            background: getBrowserColor(browser._id)
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="no-data">No browser data yet</p>
                                )}
                            </div>
                        </div>

                        {/* Hourly Traffic Pattern */}
                        <div className="data-card">
                            <h3>⏰ Hourly Traffic Pattern</h3>
                            <div className="hourly-chart">
                                {extendedStats.hourlyTraffic && extendedStats.hourlyTraffic.length > 0 ? (
                                    Array.from({ length: 24 }, (_, hour) => {
                                        const match = extendedStats.hourlyTraffic.find(h => h._id === hour);
                                        const count = match?.count || 0;
                                        const maxCount = Math.max(...extendedStats.hourlyTraffic.map(h => h.count)) || 1;
                                        const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
                                        return (
                                            <div key={hour} className="hourly-bar-container" title={`${hour}:00 - ${count} visits`}>
                                                <div
                                                    className="hourly-bar"
                                                    style={{ height: `${Math.max(height, 3)}%` }}
                                                ></div>
                                                {hour % 6 === 0 && <span className="hourly-label">{hour}h</span>}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="no-data">No hourly data yet</p>
                                )}
                            </div>
                        </div>

                        {/* Top Cities */}
                        <div className="data-card">
                            <h3>🏙️ Top Cities</h3>
                            <div className="bar-chart">
                                {extendedStats.topCities && extendedStats.topCities.length > 0 ? (
                                    extendedStats.topCities.map((city, idx) => (
                                        <div key={idx} className="bar-item">
                                            <div className="bar-label">📍 {city._id}</div>
                                            <div className="bar-container">
                                                <div
                                                    className="bar city-bar"
                                                    style={{
                                                        width: `${(city.count / (extendedStats.topCities[0]?.count || 1)) * 100}%`
                                                    }}
                                                ></div>
                                                <span className="bar-value">{city.count}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="no-data">No city data yet</p>
                                )}
                            </div>
                        </div>

                        {/* Top Projects */}
                        <div className="data-card">
                            <h3>🚀 Most Clicked Projects</h3>
                            <div className="projects-chart">
                                {topProjects.length > 0 ? (
                                    topProjects.map((project, idx) => (
                                        <div key={idx} className="project-item">
                                            <div className="project-rank">#{idx + 1}</div>
                                            <div className="project-name">{project._id || 'Unknown'}</div>
                                            <div className="project-clicks">{project.count} clicks</div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="no-data">No project clicks yet</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'visitors' && (
                    <div className="visitors-section">
                        {/* Visitor Stats Summary */}
                        <div className="visitor-summary">
                            <div className="summary-card">
                                <span className="summary-icon">📊</span>
                                <div className="summary-content">
                                    <span className="summary-value">{totalVisitors}</span>
                                    <span className="summary-label">Total Records</span>
                                </div>
                            </div>
                            <div className="summary-card">
                                <span className="summary-icon">📄</span>
                                <div className="summary-content">
                                    <span className="summary-value">Page {page} of {totalPages}</span>
                                    <span className="summary-label">Current Page</span>
                                </div>
                            </div>
                            <div className="summary-card">
                                <span className="summary-icon">👁️</span>
                                <div className="summary-content">
                                    <span className="summary-value">{visitors.length}</span>
                                    <span className="summary-label">Showing</span>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Visitors Table */}
                        <div className="visitors-table-container">
                            <table className="visitors-table">
                                <thead>
                                    <tr>
                                        <th>Time</th>
                                        <th>Location</th>
                                        <th>Device</th>
                                        <th>Browser</th>
                                        <th>Source</th>
                                        <th>Path</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {visitors.length > 0 ? (
                                        visitors.map((visitor, idx) => (
                                            <tr key={idx} className={visitor.referrer === 'LinkedIn' ? 'linkedin-row' : ''}>
                                                <td>
                                                    <div className="visitor-time">
                                                        <span className="time-main">{formatDate(visitor.timestamp)}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="visitor-location">
                                                        <span className="location-flag">{getCountryFlag(visitor.country)}</span>
                                                        <div className="location-text">
                                                            <span className="location-city">{visitor.city}</span>
                                                            <span className="location-country">{visitor.country}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="device-badge">
                                                        {getDeviceIcon(visitor.device)} {visitor.device}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="browser-badge" style={{ borderColor: getBrowserColor(visitor.browser) }}>
                                                        {getBrowserIcon(visitor.browser)} {visitor.browser}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`source-badge ${visitor.referrer?.toLowerCase()}`}>
                                                        {getReferrerIcon(visitor.referrer)} {visitor.referrer}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="path-badge">{visitor.path || '/'}</span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="no-data-cell">No visitor data yet</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="pagination">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                ← Previous
                            </button>
                            <div className="pagination-info">
                                <span>Page {page} of {totalPages}</span>
                                <span className="pagination-total">({totalVisitors} total records)</span>
                            </div>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'clicks' && (
                    <div className="clicks-section">
                        <div className="clicks-header">
                            <h3>🖱️ User Clicks & Interactions</h3>
                            <span className="clicks-count">{events.length} interactions tracked</span>
                        </div>

                        {/* Click Categories Summary */}
                        <div className="click-categories">
                            <div className="category-card">
                                <span className="category-icon">⚡</span>
                                <div className="category-content">
                                    <span className="category-value">
                                        {events.filter(e => e.eventType === 'project_click').length}
                                    </span>
                                    <span className="category-label">Project Clicks</span>
                                </div>
                            </div>
                            <div className="category-card">
                                <span className="category-icon">🔗</span>
                                <div className="category-content">
                                    <span className="category-value">
                                        {events.filter(e => e.eventType === 'link_click').length}
                                    </span>
                                    <span className="category-label">Link Clicks</span>
                                </div>
                            </div>
                            <div className="category-card">
                                <span className="category-icon">📍</span>
                                <div className="category-content">
                                    <span className="category-value">
                                        {events.filter(e => e.eventType === 'section_view').length}
                                    </span>
                                    <span className="category-label">Section Views</span>
                                </div>
                            </div>
                            <div className="category-card">
                                <span className="category-icon">📝</span>
                                <div className="category-content">
                                    <span className="category-value">
                                        {events.filter(e => e.eventType === 'form_submit').length}
                                    </span>
                                    <span className="category-label">Form Submits</span>
                                </div>
                            </div>
                        </div>

                        {/* All Click Events */}
                        <div className="data-card">
                            <h3>⚡ All Click Events</h3>
                            <div className="clicks-list">
                                {events.length === 0 ? (
                                    <p className="no-data">No click events tracked yet</p>
                                ) : (
                                    events.map((event, idx) => {
                                        const getEventIcon = (type) => {
                                            switch (type) {
                                                case 'project_click': return '📂';
                                                case 'link_click': return '🔗';
                                                case 'section_view': return '📍';
                                                case 'form_submit': return '📝';
                                                case 'button_click': return '🔘';
                                                case 'social_click': return '📱';
                                                default: return '👆';
                                            }
                                        };

                                        const getEventLabel = (event) => {
                                            if (event.eventType === 'project_click') {
                                                return event.eventData?.projectName || 'Unknown Project';
                                            }
                                            if (event.eventData?.element) {
                                                return event.eventData.element;
                                            }
                                            if (event.eventData?.label) {
                                                return event.eventData.label;
                                            }
                                            return JSON.stringify(event.eventData || {});
                                        };

                                        return (
                                            <div key={idx} className="click-item">
                                                <div className="click-icon">{getEventIcon(event.eventType)}</div>
                                                <div className="click-details">
                                                    <span className="click-type">{event.eventType.replace(/_/g, ' ')}</span>
                                                    <span className="click-label">{getEventLabel(event)}</span>
                                                </div>
                                                <span className="click-time">{formatDate(event.timestamp)}</span>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'insights' && (
                    <div className="insights-section">
                        <div className="insights-header">
                            <h2>💡 Analytics Insights</h2>
                            <p className="insights-subtitle">Auto-generated insights based on your data</p>
                        </div>
                        <div className="insights-grid">
                            {insights.length === 0 ? (
                                <p className="no-data">Not enough data to generate insights yet. Keep building traffic!</p>
                            ) : (
                                insights.map((insight, idx) => (
                                    <div key={idx} className={`insight-card ${insight.type}`}>
                                        <span className="insight-icon">{insight.icon}</span>
                                        <span className="insight-text">{insight.text}</span>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Quick Stats Summary */}
                        <div className="summary-section">
                            <h3>📊 Performance Summary</h3>
                            <div className="summary-grid">
                                <div className="summary-item">
                                    <span className="summary-label">This Week</span>
                                    <span className="summary-value">{extendedStats.weeklyComparison?.current || 0} views</span>
                                </div>
                                <div className="summary-item">
                                    <span className="summary-label">Last Week</span>
                                    <span className="summary-value">{extendedStats.weeklyComparison?.previous || 0} views</span>
                                </div>
                                <div className="summary-item">
                                    <span className="summary-label">Avg Daily</span>
                                    <span className="summary-value">{avgDailyViews} views</span>
                                </div>
                                <div className="summary-item">
                                    <span className="summary-label">Projects Clicked</span>
                                    <span className="summary-value">{stats.projectClicks || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'messages' && (
                    <div className="messages-section">
                        <div className="messages-header">
                            <h3>📬 Contact Form Submissions</h3>
                            <span className="messages-count">{messages.length} messages</span>
                        </div>

                        {messages.length === 0 ? (
                            <div className="no-messages">
                                <span className="no-messages-icon">📭</span>
                                <p>No contact form submissions yet</p>
                                <p className="no-messages-hint">Messages from your portfolio contact form will appear here</p>
                            </div>
                        ) : (
                            <div className="messages-list">
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`message-card ${msg.status || 'new'}`}>
                                        <div className="message-header">
                                            <div className="message-sender">
                                                <span className="sender-icon">👤</span>
                                                <div className="sender-info">
                                                    <span className="sender-name">{msg.name}</span>
                                                    <a href={`mailto:${msg.email}`} className="sender-email">{msg.email}</a>
                                                </div>
                                            </div>
                                            <div className="message-meta">
                                                <span className="message-time">{formatDate(msg.timestamp)}</span>
                                                {msg.status === 'replied' && <span className="email-sent-badge">↩️ Replied</span>}
                                                {msg.status === 'read' && <span className="email-sent-badge">✓ Read</span>}
                                                {msg.status === 'new' && <span className="email-sent-badge new">New</span>}
                                            </div>
                                        </div>
                                        <div className="message-subject">
                                            <span className="subject-icon">📋</span>
                                            <span className="subject-text">{msg.subject}</span>
                                        </div>
                                        <div className="message-body">
                                            <p>{msg.message}</p>
                                        </div>
                                        <div className="message-actions">
                                            <button
                                                className="action-btn reply-btn"
                                                onClick={() => handleReply(msg)}
                                            >
                                                ↩️ Reply
                                            </button>
                                            {msg.status === 'new' && (
                                                <button
                                                    className="action-btn mark-read-btn"
                                                    onClick={(e) => handleMarkAsRead(msg._id, e)}
                                                >
                                                    ✓ Mark as Read
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Reply Modal */}
            {replyModalOpen && (
                <div className="modal-overlay" onClick={closeReplyModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Reply to {replyData.name}</h3>
                            <button className="close-modal-btn" onClick={closeReplyModal}>&times;</button>
                        </div>
                        <form onSubmit={sendReply}>
                            <div className="form-group">
                                <label>To</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={replyData.to}
                                    disabled
                                />
                            </div>
                            <div className="form-group">
                                <label>Subject</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={replyData.subject}
                                    onChange={(e) => setReplyData({ ...replyData, subject: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Message</label>
                                <textarea
                                    className="form-textarea"
                                    value={replyData.message}
                                    onChange={(e) => setReplyData({ ...replyData, message: e.target.value })}
                                    placeholder="Type your reply here..."
                                    required
                                ></textarea>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={closeReplyModal}>Cancel</button>
                                <button type="submit" className="send-btn" disabled={isSendingReply}>
                                    {isSendingReply ? 'Sending...' : 'Send Reply 🚀'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Refresh Button */}
            <button className="refresh-btn" onClick={fetchData}>
                🔄 Refresh Data
            </button>
        </div>
    );
};

export default AnalyticsDashboard;

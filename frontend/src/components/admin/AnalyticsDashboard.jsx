import React, { useState, useEffect, useCallback } from 'react';
import './AnalyticsDashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AnalyticsDashboard = ({ token, onLogout }) => {
    const [stats, setStats] = useState(null);
    const [visitors, setVisitors] = useState([]);
    const [events, setEvents] = useState([]);
    const [liveData, setLiveData] = useState({ liveCount: 0, activeSessions: [] });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchWithAuth = useCallback(async (endpoint) => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.json();
    }, [token]);

    const fetchData = useCallback(async () => {
        try {
            const [statsData, visitorsData, eventsData, liveDataRes] = await Promise.all([
                fetchWithAuth('/api/analytics/stats'),
                fetchWithAuth(`/api/analytics/visitors?page=${page}&limit=15`),
                fetchWithAuth('/api/analytics/events?limit=30'),
                fetchWithAuth('/api/analytics/live')
            ]);

            if (statsData.success) setStats(statsData.stats);
            if (visitorsData.success) {
                setVisitors(visitorsData.visitors);
                setTotalPages(visitorsData.totalPages);
            }
            if (eventsData.success) setEvents(eventsData.events);
            if (liveDataRes.success) setLiveData(liveDataRes);
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    }, [fetchWithAuth, page]);

    // Initial fetch
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Refresh live count every 5 seconds
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const liveDataRes = await fetchWithAuth('/api/analytics/live');
                if (liveDataRes.success) setLiveData(liveDataRes);
            } catch (error) {
                // Silent fail for live updates
            }
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

    const getDeviceIcon = (device) => {
        switch (device) {
            case 'Mobile': return '📱';
            case 'Tablet': return '📱';
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

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>
                <p>Loading Analytics...</p>
            </div>
        );
    }

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
                <button className="logout-btn" onClick={onLogout}>
                    Logout 🚪
                </button>
            </header>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card primary">
                    <div className="stat-icon">👁️</div>
                    <div className="stat-content">
                        <span className="stat-value">{stats?.totalViews || 0}</span>
                        <span className="stat-label">Total Views</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">👤</div>
                    <div className="stat-content">
                        <span className="stat-value">{stats?.uniqueVisitors || 0}</span>
                        <span className="stat-label">Unique Visitors</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📅</div>
                    <div className="stat-content">
                        <span className="stat-value">{stats?.todayViews || 0}</span>
                        <span className="stat-label">Today</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">⚡</div>
                    <div className="stat-content">
                        <span className="stat-value">{stats?.projectClicks || 0}</span>
                        <span className="stat-label">Project Clicks</span>
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
                                <span>{session.country}</span>
                                <span className="referrer-badge">{getReferrerIcon(session.referrer)} {session.referrer}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    Overview
                </button>
                <button
                    className={`tab ${activeTab === 'visitors' ? 'active' : ''}`}
                    onClick={() => setActiveTab('visitors')}
                >
                    Visitors
                </button>
                <button
                    className={`tab ${activeTab === 'events' ? 'active' : ''}`}
                    onClick={() => setActiveTab('events')}
                >
                    Events
                </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
                {activeTab === 'overview' && (
                    <div className="overview-grid">
                        {/* Top Referrers */}
                        <div className="data-card">
                            <h3>📊 Top Referrers</h3>
                            <div className="bar-chart">
                                {stats?.topReferrers?.map((ref, idx) => (
                                    <div key={idx} className="bar-item">
                                        <div className="bar-label">
                                            {getReferrerIcon(ref._id)} {ref._id}
                                        </div>
                                        <div className="bar-container">
                                            <div
                                                className="bar"
                                                style={{
                                                    width: `${(ref.count / (stats?.topReferrers[0]?.count || 1)) * 100}%`
                                                }}
                                            ></div>
                                            <span className="bar-value">{ref.count}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top Countries */}
                        <div className="data-card">
                            <h3>🌍 Top Countries</h3>
                            <div className="bar-chart">
                                {stats?.topCountries?.map((country, idx) => (
                                    <div key={idx} className="bar-item">
                                        <div className="bar-label">
                                            🌐 {country._id}
                                        </div>
                                        <div className="bar-container">
                                            <div
                                                className="bar country-bar"
                                                style={{
                                                    width: `${(country.count / (stats?.topCountries[0]?.count || 1)) * 100}%`
                                                }}
                                            ></div>
                                            <span className="bar-value">{country.count}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Views Chart (Last 7 days) */}
                        <div className="data-card wide">
                            <h3>📈 Views (Last 7 Days)</h3>
                            <div className="simple-chart">
                                {stats?.last7DaysViews?.map((day, idx) => (
                                    <div key={idx} className="chart-bar-container">
                                        <div
                                            className="chart-bar"
                                            style={{
                                                height: `${(day.count / Math.max(...(stats?.last7DaysViews?.map(d => d.count) || [1]))) * 100}%`
                                            }}
                                        >
                                            <span className="chart-value">{day.count}</span>
                                        </div>
                                        <span className="chart-label">{day._id.slice(5)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'visitors' && (
                    <div className="visitors-section">
                        <table className="visitors-table">
                            <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>Location</th>
                                    <th>Device</th>
                                    <th>Browser</th>
                                    <th>Source</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visitors.map((visitor, idx) => (
                                    <tr key={idx} className={visitor.referrer === 'LinkedIn' ? 'linkedin-row' : ''}>
                                        <td>{formatDate(visitor.timestamp)}</td>
                                        <td>{visitor.city}, {visitor.country}</td>
                                        <td>{getDeviceIcon(visitor.device)} {visitor.device}</td>
                                        <td>{visitor.browser}</td>
                                        <td>
                                            <span className={`source-badge ${visitor.referrer.toLowerCase()}`}>
                                                {getReferrerIcon(visitor.referrer)} {visitor.referrer}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="pagination">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                ← Prev
                            </button>
                            <span>Page {page} of {totalPages}</span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'events' && (
                    <div className="events-section">
                        <h3>⚡ Recent Events</h3>
                        <div className="events-list">
                            {events.length === 0 ? (
                                <p className="no-events">No events tracked yet</p>
                            ) : (
                                events.map((event, idx) => (
                                    <div key={idx} className="event-item">
                                        <span className="event-type">
                                            {event.eventType === 'project_click' ? '⚡' : '📌'} {event.eventType}
                                        </span>
                                        <span className="event-data">
                                            {event.eventData?.projectName || JSON.stringify(event.eventData)}
                                        </span>
                                        <span className="event-time">{formatDate(event.timestamp)}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Refresh Button */}
            <button className="refresh-btn" onClick={fetchData}>
                🔄 Refresh Data
            </button>
        </div>
    );
};

export default AnalyticsDashboard;

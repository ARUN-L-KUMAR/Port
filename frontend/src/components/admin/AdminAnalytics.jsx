import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AnalyticsDashboard from './AnalyticsDashboard';

const AdminAnalytics = () => {
    const [token, setToken] = useState(null);

    // Check for existing session on mount
    useEffect(() => {
        const savedToken = sessionStorage.getItem('admin_token');
        if (savedToken) {
            setToken(savedToken);
        }
    }, []);

    const handleLogin = (newToken) => {
        setToken(newToken);
    };

    const handleLogout = () => {
        sessionStorage.removeItem('admin_token');
        setToken(null);
    };

    if (!token) {
        return <AdminLogin onLogin={handleLogin} />;
    }

    return <AnalyticsDashboard token={token} onLogout={handleLogout} />;
};

export default AdminAnalytics;

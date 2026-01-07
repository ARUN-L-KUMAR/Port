import React, { useState } from 'react';
import './AdminLogin.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AdminLogin = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/analytics/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            const data = await response.json();

            if (data.success) {
                sessionStorage.setItem('admin_token', data.token);
                onLogin(data.token);
            } else {
                setError(data.message || 'Invalid credentials');
            }
        } catch (err) {
            setError('Connection failed. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-box">
                <div className="login-header">
                    <div className="lock-icon">🔐</div>
                    <h1>Admin Access</h1>
                    <p>Portfolio Analytics Dashboard</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter admin secret..."
                            autoFocus
                            disabled={loading}
                        />
                        <div className="input-glow"></div>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" disabled={loading || !password}>
                        {loading ? (
                            <span className="loading-spinner"></span>
                        ) : (
                            <>Access Dashboard</>
                        )}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Secure access only</p>
                </div>
            </div>

            <div className="background-effects">
                <div className="grid-overlay"></div>
                <div className="glow-orb orb-1"></div>
                <div className="glow-orb orb-2"></div>
            </div>
        </div>
    );
};

export default AdminLogin;

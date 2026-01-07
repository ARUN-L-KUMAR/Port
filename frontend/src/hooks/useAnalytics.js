import { useEffect, useRef, useCallback } from 'react';

// API base URL - change for production
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Generate or retrieve session ID
const getSessionId = () => {
    let sessionId = sessionStorage.getItem('portfolio_session');
    if (!sessionId) {
        sessionId = 'sess_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
        sessionStorage.setItem('portfolio_session', sessionId);
    }
    return sessionId;
};

export const useAnalytics = () => {
    const sessionId = useRef(getSessionId());
    const hasTracked = useRef(false);
    const heartbeatInterval = useRef(null);

    // Track initial visit - only once per browser session
    const trackVisit = useCallback(async () => {
        // Check if we already tracked this session
        const alreadyTracked = sessionStorage.getItem('portfolio_tracked');
        if (hasTracked.current || alreadyTracked) {
            hasTracked.current = true;
            return;
        }

        hasTracked.current = true;
        sessionStorage.setItem('portfolio_tracked', 'true');

        try {
            await fetch(`${API_URL}/api/analytics/track`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: sessionId.current,
                    path: window.location.pathname,
                    referrer: document.referrer || null
                })
            });
        } catch (error) {
            console.log('Analytics tracking unavailable');
        }
    }, []);

    // Send heartbeat to maintain live status
    const sendHeartbeat = useCallback(async () => {
        try {
            await fetch(`${API_URL}/api/analytics/heartbeat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId: sessionId.current })
            });
        } catch (error) {
            // Silently fail heartbeat
        }
    }, []);

    // Track custom events (like project clicks)
    const trackEvent = useCallback(async (eventType, eventData = {}) => {
        try {
            await fetch(`${API_URL}/api/analytics/event`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: sessionId.current,
                    eventType,
                    eventData
                })
            });
        } catch (error) {
            // Silently fail event tracking
        }
    }, []);

    useEffect(() => {
        // Track initial visit
        trackVisit();

        // Start heartbeat (every 30 seconds)
        heartbeatInterval.current = setInterval(sendHeartbeat, 30000);

        // Cleanup on unmount
        return () => {
            if (heartbeatInterval.current) {
                clearInterval(heartbeatInterval.current);
            }
        };
    }, [trackVisit, sendHeartbeat]);

    return { trackEvent, sessionId: sessionId.current };
};

export default useAnalytics;

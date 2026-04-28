import { useEffect, useRef, useCallback } from 'react';

// API base URL - change for production
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const IDLE_TIMEOUT = 60000;

let activeHookCount = 0;
let globalHeartbeatInterval = null;

const isLocalHost = (hostname) => {
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
};

const isPrivateHost = (hostname) => {
    if (!hostname) return false;
    if (hostname.startsWith('192.168.') || hostname.startsWith('10.')) return true;
    return /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname);
};

const isLocalLikeHost = (hostname) => isLocalHost(hostname) || isPrivateHost(hostname);

const getLocalAllowDev = () => {
    if (typeof window === 'undefined') return false;
    try {
        return window.localStorage.getItem('analytics_allow_dev') === 'true';
    } catch (error) {
        return false;
    }
};

const getDefaultTrackingEnabled = () => {
    if (process.env.REACT_APP_ANALYTICS_ENABLED === 'true') return true;
    if (getLocalAllowDev()) return true;
    if (process.env.NODE_ENV === 'production') {
        if (typeof window === 'undefined') return true;
        return !isLocalLikeHost(window.location.hostname);
    }
    return false;
};

const isAdminRoute = () => {
    if (typeof window === 'undefined') return false;
    return window.location.pathname.startsWith('/admin-analytics');
};

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
    const configRef = useRef({ loaded: false, enabled: null, allowDev: null });
    const trackingEnabledRef = useRef(null);
    const lastActivityRef = useRef(Date.now());

    const computeTrackingEnabled = useCallback(() => {
        if (typeof window === 'undefined') {
            return process.env.REACT_APP_ANALYTICS_ENABLED === 'true' || process.env.NODE_ENV === 'production';
        }

        const hostname = window.location.hostname;
        const isLocal = isLocalLikeHost(hostname);

        if (configRef.current.loaded) {
            if (!configRef.current.enabled) return false;
            if (isLocal && !configRef.current.allowDev) return false;
            return true;
        }

        return getDefaultTrackingEnabled();
    }, []);

    if (trackingEnabledRef.current === null) {
        trackingEnabledRef.current = computeTrackingEnabled();
    }

    const markActivity = useCallback(() => {
        lastActivityRef.current = Date.now();
    }, []);

    const shouldTrack = useCallback(() => {
        if (!trackingEnabledRef.current) return false;
        if (isAdminRoute()) return false;
        return true;
    }, []);

    // Track initial visit - only once per browser session
    const trackVisit = useCallback(async () => {
        if (!shouldTrack()) return;

        // Check if we already tracked this session
        const alreadyTracked = sessionStorage.getItem('portfolio_tracked');
        if (hasTracked.current || alreadyTracked) {
            hasTracked.current = true;
            return;
        }

        hasTracked.current = true;
        sessionStorage.setItem('portfolio_tracked', 'true');
        markActivity();

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
    }, [markActivity, shouldTrack]);

    // Send heartbeat to maintain live status
    const sendHeartbeat = useCallback(async () => {
        if (!shouldTrack()) return;
        if (document.visibilityState !== 'visible') return;
        if (Date.now() - lastActivityRef.current > IDLE_TIMEOUT) return;

        try {
            await fetch(`${API_URL}/api/analytics/heartbeat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId: sessionId.current })
            });
        } catch (error) {
            // Silently fail heartbeat
        }
    }, [shouldTrack]);

    // Track custom events (like project clicks)
    const trackEvent = useCallback(async (eventType, eventData = {}) => {
        if (!shouldTrack()) return;
        markActivity();

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
    }, [markActivity, shouldTrack]);

    const updateTrackingEnabled = useCallback(() => {
        const wasEnabled = trackingEnabledRef.current;
        trackingEnabledRef.current = computeTrackingEnabled();
        if (!wasEnabled && trackingEnabledRef.current) {
            trackVisit();
        }
    }, [computeTrackingEnabled, trackVisit]);

    const fetchRemoteConfig = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/api/analytics/public-config`);
            const data = await response.json();
            if (data?.success) {
                configRef.current = {
                    loaded: true,
                    enabled: Boolean(data.enabled),
                    allowDev: Boolean(data.allowDev)
                };
                updateTrackingEnabled();
            }
        } catch (error) {
            // Ignore config fetch errors
        }
    }, [updateTrackingEnabled]);

    useEffect(() => {
        const handleActivity = () => markActivity();
        const events = ['mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
        events.forEach((evt) => window.addEventListener(evt, handleActivity, { passive: true }));
        document.addEventListener('visibilitychange', handleActivity);

        return () => {
            events.forEach((evt) => window.removeEventListener(evt, handleActivity));
            document.removeEventListener('visibilitychange', handleActivity);
        };
    }, [markActivity]);

    useEffect(() => {
        const handleConfigUpdate = () => {
            updateTrackingEnabled();
            fetchRemoteConfig();
        };

        window.addEventListener('analytics-config-updated', handleConfigUpdate);
        window.addEventListener('storage', handleConfigUpdate);

        return () => {
            window.removeEventListener('analytics-config-updated', handleConfigUpdate);
            window.removeEventListener('storage', handleConfigUpdate);
        };
    }, [fetchRemoteConfig, updateTrackingEnabled]);

    useEffect(() => {
        fetchRemoteConfig();
    }, [fetchRemoteConfig]);

    useEffect(() => {
        // Track initial visit
        trackVisit();

        activeHookCount += 1;
        if (!globalHeartbeatInterval) {
            globalHeartbeatInterval = setInterval(sendHeartbeat, 30000);
        }

        return () => {
            activeHookCount = Math.max(0, activeHookCount - 1);
            if (activeHookCount === 0 && globalHeartbeatInterval) {
                clearInterval(globalHeartbeatInterval);
                globalHeartbeatInterval = null;
            }
        };
    }, [trackVisit, sendHeartbeat]);

    return { trackEvent, sessionId: sessionId.current };
};

export default useAnalytics;

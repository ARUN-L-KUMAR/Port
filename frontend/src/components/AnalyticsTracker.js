import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useAnalytics from '../hooks/useAnalytics';

/**
 * Invisible component that tracks visitors.
 * Add this to your App.js to enable analytics.
 */
const AnalyticsTracker = () => {
    const { sessionId, trackEvent } = useAnalytics();
    const location = useLocation();

    useEffect(() => {
        // Log for debugging
        if (process.env.NODE_ENV === 'development') {
            console.log('📊 Analytics active, session:', sessionId);
        }
    }, [sessionId]);

    // Track page views on route change
    useEffect(() => {
        if (trackEvent) {
            trackEvent('page_view', {
                path: location.pathname,
                title: document.title
            });
        }
    }, [location.pathname, trackEvent]);

    // This component renders nothing
    return null;
};

export default AnalyticsTracker;

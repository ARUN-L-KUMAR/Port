import { useEffect } from 'react';
import useAnalytics from '../hooks/useAnalytics';

/**
 * Invisible component that tracks visitors.
 * Add this to your App.js to enable analytics.
 */
const AnalyticsTracker = () => {
    const { sessionId } = useAnalytics();

    useEffect(() => {
        // Log for debugging (remove in production if desired)
        if (process.env.NODE_ENV === 'development') {
            console.log('📊 Analytics active, session:', sessionId);
        }
    }, [sessionId]);

    // This component renders nothing
    return null;
};

export default AnalyticsTracker;

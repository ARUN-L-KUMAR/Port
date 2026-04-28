import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import useAnalytics from '../hooks/useAnalytics';

/**
 * Invisible component that tracks visitors.
 * Add this to your App.js to enable analytics.
 */
const AnalyticsTracker = () => {
    const { sessionId, trackEvent } = useAnalytics();
    const location = useLocation();
    const trackedSections = useRef(new Set());

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

    useEffect(() => {
        trackedSections.current.clear();
    }, [location.pathname]);

    useEffect(() => {
        if (!trackEvent) return undefined;

        const sectionIds = ['hero', 'about', 'projects', 'skills', 'contact'];
        const sectionElements = sectionIds
            .map((id) => document.getElementById(id))
            .filter(Boolean);

        if (sectionElements.length === 0) return undefined;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const sectionId = entry.target.id;
                if (!sectionId || trackedSections.current.has(sectionId)) return;

                trackedSections.current.add(sectionId);
                trackEvent('section_view', {
                    section: sectionId,
                    path: location.pathname,
                    title: document.title
                });
            });
        }, { threshold: 0.5 });

        sectionElements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, [location.pathname, trackEvent]);

    // This component renders nothing
    return null;
};

export default AnalyticsTracker;

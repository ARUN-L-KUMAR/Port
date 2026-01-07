// EmailJS-based email service (works on Render free tier)
const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID || 'service_ouq955n';
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID || 'template_py4y9co';
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY || 'N7fgACS-m8PSrnVJo';

let isConfigured = false;

const initializeTransporter = () => {
    if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
        isConfigured = true;
        console.log('📧 EmailJS service initialized');
    } else {
        console.log('📧 EmailJS not fully configured (missing SERVICE_ID, TEMPLATE_ID, or PUBLIC_KEY)');
    }
};

const sendLinkedInVisitorNotification = async (visitorData) => {
    console.log('📧 Attempting to send LinkedIn notification via EmailJS...');

    if (!isConfigured) {
        console.log('❌ Email not sent - EmailJS not configured');
        return false;
    }

    const { country, city, device, browser, timestamp } = visitorData;

    // Format timestamp for display
    const formattedTime = new Date(timestamp).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'medium',
        timeStyle: 'short'
    });

    // EmailJS template parameters (must match your template variables)
    const templateParams = {
        country: country || 'Unknown',
        city: city || 'Unknown',
        device: device || 'Unknown',
        browser: browser || 'Unknown',
        timestamp: formattedTime,
        // Add these in case your template uses different names
        location: `${city || 'Unknown'}, ${country || 'Unknown'}`,
        time: formattedTime
    };

    console.log('📧 Template params:', JSON.stringify(templateParams, null, 2));

    try {
        // EmailJS REST API
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                service_id: EMAILJS_SERVICE_ID,
                template_id: EMAILJS_TEMPLATE_ID,
                user_id: EMAILJS_PUBLIC_KEY,
                template_params: templateParams
            })
        });

        if (response.ok) {
            console.log('✅ LinkedIn visitor notification sent via EmailJS!');
            return true;
        } else {
            const errorText = await response.text();
            console.error('❌ EmailJS API error:', response.status, errorText);
            return false;
        }
    } catch (error) {
        console.error('❌ Failed to send email via EmailJS:', error.message);
        return false;
    }
};

module.exports = {
    initializeTransporter,
    sendLinkedInVisitorNotification
};

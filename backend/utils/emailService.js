// Resend-based email service (works on Render free tier)
const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_P8xnMbHk_F8cdK6JaRSG3xHKUM68Jbd3q';
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'arunkumar582004@gmail.com';

let isConfigured = false;

const initializeTransporter = () => {
    if (RESEND_API_KEY) {
        isConfigured = true;
        console.log('📧 Resend email service initialized');
    } else {
        console.log('📧 Resend not configured (missing RESEND_API_KEY)');
    }
};

const sendLinkedInVisitorNotification = async (visitorData) => {
    console.log('📧 Attempting to send LinkedIn notification via Resend...');

    if (!isConfigured) {
        console.log('❌ Email not sent - Resend not configured');
        return false;
    }

    const { country, city, device, browser, timestamp } = visitorData;

    // Format timestamp for display
    const formattedTime = new Date(timestamp).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'medium',
        timeStyle: 'short'
    });

    const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%); color: #fff; padding: 30px; border-radius: 15px;">
        <h1 style="color: #00ff88; text-align: center; margin-bottom: 30px;">
            🚀 New Visitor from LinkedIn!
        </h1>
        
        <div style="background: rgba(0, 255, 136, 0.1); border: 1px solid #00ff88; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
            <h2 style="color: #00ff88; margin-top: 0;">Visitor Details</h2>
            <table style="width: 100%; color: #fff;">
                <tr>
                    <td style="padding: 8px 0; color: #888;">📍 Location:</td>
                    <td style="padding: 8px 0;">${city || 'Unknown'}, ${country || 'Unknown'}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #888;">💻 Device:</td>
                    <td style="padding: 8px 0;">${device || 'Unknown'}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #888;">🌐 Browser:</td>
                    <td style="padding: 8px 0;">${browser || 'Unknown'}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #888;">🕐 Time:</td>
                    <td style="padding: 8px 0;">${formattedTime}</td>
                </tr>
            </table>
        </div>
        
        <p style="color: #888; text-align: center; margin-top: 30px; font-size: 12px;">
            This notification was sent from your Portfolio Analytics System
        </p>
    </div>
    `;

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'Portfolio Analytics <onboarding@resend.dev>',
                to: [NOTIFY_EMAIL],
                subject: '🔔 LinkedIn Visitor on Your Portfolio!',
                html: htmlContent
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ LinkedIn visitor notification sent via Resend!');
            console.log('   Email ID:', data.id);
            return true;
        } else {
            console.error('❌ Resend API error:', response.status, JSON.stringify(data));
            return false;
        }
    } catch (error) {
        console.error('❌ Failed to send email via Resend:', error.message);
        return false;
    }
};

module.exports = {
    initializeTransporter,
    sendLinkedInVisitorNotification
};

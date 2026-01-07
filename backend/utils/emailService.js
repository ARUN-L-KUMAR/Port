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

// Rename existing function for clarity
const sendEntryAlertEmail = async (visitorData) => {
    console.log('📧 Attempting to send Entry Alert via Resend...');

    if (!isConfigured) {
        console.log('❌ Email not sent - Resend not configured');
        return false;
    }

    const { country, city, device, browser, timestamp, referrer, referrerFull } = visitorData;

    // Format timestamp for display
    const formattedTime = new Date(timestamp).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'medium',
        timeStyle: 'short'
    });

    const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%); color: #fff; padding: 30px; border-radius: 15px;">
        <h1 style="color: #00ff88; text-align: center; margin-bottom: 30px;">
            🚀 New Visitor Alert!
        </h1>
        
        <div style="background: rgba(0, 255, 136, 0.1); border: 1px solid #00ff88; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
            <p style="text-align: center; font-size: 16px;">
                A new visitor just arrived from <strong>${referrer || 'Unknown Source'}</strong>
            </p>
            <table style="width: 100%; color: #fff; margin-top: 20px;">
                <tr>
                    <td style="padding: 8px 0; color: #888;">📍 Location:</td>
                    <td style="padding: 8px 0;">${city || 'Unknown'}, ${country || 'Unknown'}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #888;">💻 Device:</td>
                    <td style="padding: 8px 0;">${device || 'Unknown'} (${browser || 'Unknown'})</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #888;">🔗 Source:</td>
                    <td style="padding: 8px 0; word-break: break-all;">${referrerFull || 'Direct'}</td>
                </tr>
            </table>
        </div>
        
        <p style="color: #888; text-align: center; margin-top: 30px; font-size: 12px;">
            Entry Alert • Portfolio Analytics System
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
                from: 'Portfolio Alert <onboarding@resend.dev>',
                to: [NOTIFY_EMAIL],
                subject: `🚀 New Visitor from ${referrer || 'Unknown source'}`,
                html: htmlContent
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ Entry Alert email sent via Resend!');
            return true;
        } else {
            console.error('❌ Resend API error:', response.status, JSON.stringify(data));
            return false;
        }
    } catch (error) {
        console.error('❌ Failed to send Entry Alert via Resend:', error.message);
        return false;
    }
};

const sendExitReportEmail = async (sessionData) => {
    console.log('📧 Attempting to send Exit Intelligence Report via Resend...');

    if (!isConfigured) {
        console.log('❌ Email not sent - Resend not configured');
        return false;
    }

    const {
        country, city, device, browser, timestamp,
        referrer, pages = [], events = [], duration = 0
    } = sessionData;

    // Calculate duration string
    const durationMinutes = Math.floor(duration / 60);
    const durationSeconds = Math.round(duration % 60);
    const durationText = `${durationMinutes}m ${durationSeconds}s`;

    // Format pages list
    const pagesListHtml = pages.map((p, i) =>
        `<tr>
            <td style="padding: 5px 0; color: #888;">${i + 1}.</td>
            <td style="padding: 5px 0; color: #fff;">${p.path}</td>
            <td style="padding: 5px 0; color: #888; text-align: right;">${new Date(p.time).toLocaleTimeString()}</td>
        </tr>`
    ).join('');

    const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%); color: #fff; padding: 30px; border-radius: 15px;">
        <h1 style="color: #00ff88; text-align: center; margin-bottom: 10px;">
            📊 Visitor Session Report
        </h1>
        <p style="text-align: center; color: #888; margin-bottom: 30px;">
            Intelligence Report for Session #${sessionData.sessionId?.substring(0, 8)}
        </p>
        
        <!-- Visitor Identity -->
        <div style="background: rgba(0, 255, 136, 0.05); border: 1px solid rgba(0, 255, 136, 0.3); border-radius: 10px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #00ff88; margin-top: 0; border-bottom: 1px solid rgba(0, 255, 136, 0.2); padding-bottom: 10px;">🔍 Identity & Location</h3>
            <table style="width: 100%; color: #fff;">
                <tr><td style="padding: 5px 0; color: #888;">Source:</td><td>${referrer || 'Direct'}</td></tr>
                <tr><td style="padding: 5px 0; color: #888;">Location:</td><td>${city}, ${country}</td></tr>
                <tr><td style="padding: 5px 0; color: #888;">Device:</td><td>${device} (${browser})</td></tr>
            </table>
        </div>

        <!-- Engagement Stats -->
        <div style="background: rgba(0, 255, 136, 0.05); border: 1px solid rgba(0, 255, 136, 0.3); border-radius: 10px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #00ff88; margin-top: 0; border-bottom: 1px solid rgba(0, 255, 136, 0.2); padding-bottom: 10px;">📈 Engagement</h3>
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <div style="text-align: center;">
                    <span style="display: block; font-size: 24px; font-weight: bold;">${pages.length}</span>
                    <span style="font-size: 12px; color: #888;">Pages Viewed</span>
                </div>
                <div style="text-align: center;">
                    <span style="display: block; font-size: 24px; font-weight: bold;">${durationText}</span>
                    <span style="font-size: 12px; color: #888;">Duration</span>
                </div>
                <div style="text-align: center;">
                    <span style="display: block; font-size: 24px; font-weight: bold;">${events.length}</span>
                    <span style="font-size: 12px; color: #888;">Interactions</span>
                </div>
            </div>
            
            <h4 style="margin: 15px 0 10px; color: #ddd;">Navigation Path</h4>
            <table style="width: 100%; font-size: 14px;">
                ${pagesListHtml}
            </table>
        </div>
        
        <p style="color: #888; text-align: center; margin-top: 30px; font-size: 12px;">
            Exit Report • Portfolio Analytics System
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
                from: 'Portfolio Intelligence <onboarding@resend.dev>',
                to: [NOTIFY_EMAIL],
                subject: `📊 Visit Report: ${durationText} on site from ${city}`,
                html: htmlContent
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ Exit Report email sent via Resend!');
            return true;
        } else {
            console.error('❌ Resend API error:', response.status, JSON.stringify(data));
            return false;
        }
    } catch (error) {
        console.error('❌ Failed to send Exit Report via Resend:', error.message);
        return false;
    }
};

// Contact form email handler
const sendContactFormEmail = async (contactData) => {
    console.log('📧 Attempting to send contact form email via Resend...');

    if (!isConfigured) {
        console.log('❌ Email not sent - Resend not configured');
        return { success: false, error: 'Email service not configured' };
    }

    const { name, email, subject, message } = contactData;

    // Format timestamp for display
    const formattedTime = new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'medium',
        timeStyle: 'short'
    });

    const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%); color: #fff; padding: 30px; border-radius: 15px;">
        <h1 style="color: #00ff88; text-align: center; margin-bottom: 30px;">
            📬 New Contact Form Submission!
        </h1>
        
        <div style="background: rgba(0, 255, 136, 0.1); border: 1px solid #00ff88; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
            <h2 style="color: #00ff88; margin-top: 0;">Sender Details</h2>
            <table style="width: 100%; color: #fff;">
                <tr>
                    <td style="padding: 8px 0; color: #888; width: 120px;">👤 Name:</td>
                    <td style="padding: 8px 0;">${name}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #888;">📧 Email:</td>
                    <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #00ff88;">${email}</a></td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #888;">📋 Subject:</td>
                    <td style="padding: 8px 0;">${subject}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: #888;">🕐 Received:</td>
                    <td style="padding: 8px 0;">${formattedTime}</td>
                </tr>
            </table>
        </div>
        
        <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 10px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #00ff88; margin-top: 0;">💬 Message</h3>
            <p style="color: #ccc; line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
            <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" 
               style="display: inline-block; background: #00ff88; color: #000; padding: 12px 25px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                📧 Reply to ${name}
            </a>
        </div>
        
        <p style="color: #888; text-align: center; margin-top: 30px; font-size: 12px;">
            This message was sent from your Portfolio Contact Form
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
                from: 'Portfolio Contact <onboarding@resend.dev>',
                to: [NOTIFY_EMAIL],
                reply_to: email,
                subject: `📬 Portfolio Contact: ${subject}`,
                html: htmlContent
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ Contact form email sent via Resend!');
            console.log('   Email ID:', data.id);
            return { success: true, emailId: data.id };
        } else {
            console.error('❌ Resend API error:', response.status, JSON.stringify(data));
            return { success: false, error: data.message || 'Failed to send email' };
        }
    } catch (error) {
        console.error('❌ Failed to send contact email via Resend:', error.message);
        return { success: false, error: error.message };
    }
};

module.exports = {
    initializeTransporter,
    sendLinkedInVisitorNotification,
    sendContactFormEmail
};

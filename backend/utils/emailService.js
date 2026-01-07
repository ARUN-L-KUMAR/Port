const nodemailer = require('nodemailer');

// Create transporter (configure only if email credentials are provided)
let transporter = null;

const initializeTransporter = () => {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        console.log('📧 Email service initialized');
    } else {
        console.log('📧 Email service not configured (EMAIL_USER/EMAIL_PASS missing)');
    }
};

const sendLinkedInVisitorNotification = async (visitorData) => {
    if (!transporter) {
        console.log('Email not sent - transporter not initialized');
        return false;
    }

    const notifyEmail = process.env.NOTIFY_EMAIL;
    if (!notifyEmail) {
        console.log('Email not sent - NOTIFY_EMAIL not configured');
        return false;
    }

    const { country, city, device, browser, timestamp } = visitorData;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: notifyEmail,
        subject: '🔔 LinkedIn Visitor on Your Portfolio!',
        html: `
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
              <td style="padding: 8px 0;">${new Date(timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
            </tr>
          </table>
        </div>
        
        <p style="color: #888; text-align: center; margin-top: 30px; font-size: 12px;">
          This notification was sent from your Portfolio Analytics System
        </p>
      </div>
    `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('📧 LinkedIn visitor notification sent!');
        return true;
    } catch (error) {
        console.error('Failed to send email:', error.message);
        return false;
    }
};

module.exports = {
    initializeTransporter,
    sendLinkedInVisitorNotification
};

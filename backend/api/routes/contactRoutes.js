const express = require('express');
const router = express.Router();
const { sendContactFormEmail, sendAutoReplyEmail } = require('../../utils/emailService');
const { getDatabase, isDatabaseConnected } = require('../../config/db');

// POST /api/contact - Handle contact form submission
router.post('/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email format'
            });
        }

        // Create contact submission object
        const contactSubmission = {
            name,
            email,
            subject,
            message,
            timestamp: new Date(),
            status: 'new', // new, read, replied
            emailSent: false,
            autoReplySent: false
        };

        // Store in database if connected
        let dbSaved = false;
        if (isDatabaseConnected()) {
            try {
                const db = getDatabase();
                const contactsCollection = db.collection('contacts');
                const result = await contactsCollection.insertOne(contactSubmission);
                dbSaved = true;
                console.log(`📝 Contact saved to DB with ID: ${result.insertedId}`);
            } catch (dbError) {
                console.error('❌ Failed to save contact to DB:', dbError.message);
            }
        }

        // Send email notification to you
        const emailResult = await sendContactFormEmail({ name, email, subject, message });

        // Update email status in DB if saved
        if (dbSaved && isDatabaseConnected()) {
            try {
                const db = getDatabase();
                const contactsCollection = db.collection('contacts');
                await contactsCollection.updateOne(
                    { email, timestamp: contactSubmission.timestamp },
                    {
                        $set: {
                            emailSent: emailResult.success,
                            emailId: emailResult.emailId
                        }
                    }
                );
            } catch (updateError) {
                console.error('❌ Failed to update email status:', updateError.message);
            }
        }

        if (emailResult.success || dbSaved) {
            console.log(`📧 Contact form submitted by ${name} (${email})`);
            return res.json({
                success: true,
                message: 'Message sent successfully!',
                saved: dbSaved
            });
        } else {
            console.error('❌ Failed to process contact:', emailResult.error);
            return res.status(500).json({
                success: false,
                error: 'Failed to send message. Please try again.'
            });
        }
    } catch (error) {
        console.error('❌ Contact form error:', error);
        return res.status(500).json({
            success: false,
            error: 'An error occurred. Please try again.'
        });
    }
});

// GET /api/contacts - Get all contact submissions (admin only)
router.get('/contacts', async (req, res) => {
    try {
        // Check for admin auth
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        const token = authHeader.split(' ')[1];
        const adminSecret = process.env.ADMIN_SECRET || 'Arun@005';

        if (token !== adminSecret) {
            return res.status(403).json({ success: false, error: 'Forbidden' });
        }

        if (!isDatabaseConnected()) {
            return res.json({ success: true, contacts: [], message: 'Database not connected' });
        }

        const db = getDatabase();
        const contactsCollection = db.collection('contacts');

        const contacts = await contactsCollection
            .find({})
            .sort({ timestamp: -1 })
            .limit(50)
            .toArray();

        return res.json({
            success: true,
            contacts,
            total: contacts.length
        });
    } catch (error) {
        console.error('❌ Error fetching contacts:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch contacts'
        });
    }
});

// PATCH /api/contacts/:id - Update contact status (mark as read/replied)
router.patch('/contacts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'read' or 'replied'

        // Check for admin auth
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        const token = authHeader.split(' ')[1];
        const adminSecret = process.env.ADMIN_SECRET || 'Arun@005';

        if (token !== adminSecret) {
            return res.status(403).json({ success: false, error: 'Forbidden' });
        }

        if (!isDatabaseConnected()) {
            return res.status(503).json({ success: false, error: 'Database not connected' });
        }

        const db = getDatabase();
        const contactsCollection = db.collection('contacts');
        const ObjectId = require('mongodb').ObjectId;

        const result = await contactsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { status: status } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ success: false, error: 'Contact not found or already updated' });
        }

        return res.json({ success: true, message: 'Status updated successfully' });
    } catch (error) {
        console.error('❌ Error updating contact status:', error);
        return res.status(500).json({ success: false, error: 'Failed to update status' });
    }
});

// DELETE /api/contacts - Delete all contact submissions (admin only)
router.delete('/contacts', async (req, res) => {
    try {
        // Check for admin auth
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        const token = authHeader.split(' ')[1];
        const adminSecret = process.env.ADMIN_SECRET || 'Arun@005';

        if (token !== adminSecret) {
            return res.status(403).json({ success: false, error: 'Forbidden' });
        }

        if (!isDatabaseConnected()) {
            return res.status(503).json({ success: false, error: 'Database not connected' });
        }

        const db = getDatabase();
        const contactsCollection = db.collection('contacts');

        const result = await contactsCollection.deleteMany({});
        console.log(`🗑️ Deleted ${result.deletedCount} contact messages`);

        return res.json({
            success: true,
            message: `Deleted ${result.deletedCount} messages`,
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error('❌ Error deleting contacts:', error);
        return res.status(500).json({ success: false, error: 'Failed to delete contacts' });
    }
});

module.exports = router;

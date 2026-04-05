const express = require('express');
const router = express.Router();

// Contact form submission
router.post('/submit', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // For now, just log the contact form data
        console.log('Contact Form Submission:', {
            name,
            email,
            subject,
            message,
            timestamp: new Date()
        });

        res.status(200).json({ message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ message: 'Failed to send message' });
    }
});

module.exports = router;
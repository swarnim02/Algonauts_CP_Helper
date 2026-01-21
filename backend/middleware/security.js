const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Security headers middleware
const securityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
});

// Request size limiting
const requestSizeLimit = (req, res, next) => {
    const maxSize = 1024 * 1024; // 1MB
    if (req.headers['content-length'] > maxSize) {
        return res.status(413).json({ message: 'Request too large' });
    }
    next();
};

// IP whitelist for admin operations (if needed)
const ipWhitelist = (allowedIPs = []) => {
    return (req, res, next) => {
        if (allowedIPs.length === 0) return next();
        
        const clientIP = req.ip || req.connection.remoteAddress;
        if (!allowedIPs.includes(clientIP)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
};

module.exports = {
    securityHeaders,
    requestSizeLimit,
    ipWhitelist
};
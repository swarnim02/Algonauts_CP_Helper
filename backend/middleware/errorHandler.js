// Centralized error handling middleware

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    error.statusCode = err.statusCode;

    console.error('Error:', err.message);
    if (process.env.NODE_ENV !== 'production') {
        console.error('Stack:', err.stack);
    }

    // Rejected by the CORS origin whitelist
    if (err.message && err.message.includes('is not allowed by CORS')) {
        error = { message: 'Origin not allowed', statusCode: 403 };
    }

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        error = { message: 'Resource not found', statusCode: 404 };
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        error = { message: 'Duplicate field value entered', statusCode: 400 };
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = { message, statusCode: 400 };
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        error = { message: 'Invalid token', statusCode: 401 };
    }

    if (err.name === 'TokenExpiredError') {
        error = { message: 'Token expired', statusCode: 401 };
    }

    // Fall back to any status already set on the response before defaulting to 500
    const fallback = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

    res.status(error.statusCode || fallback).json({
        success: false,
        message: error.message || 'Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

// 404 handler - forwards to errorHandler with an explicit status
const notFound = (req, res, next) => {
    const error = new Error(`Not found - ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
};

module.exports = {
    errorHandler,
    notFound
};

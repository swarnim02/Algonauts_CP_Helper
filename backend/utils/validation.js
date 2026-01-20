// Input validation utilities for enhanced security

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    return password && password.length >= 6;
};

const validateName = (name) => {
    return name && name.trim().length >= 2 && name.trim().length <= 50;
};

const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input.trim().replace(/[<>]/g, '');
};

const validateCodeforcesHandle = (handle) => {
    if (!handle) return true; // Optional field
    const handleRegex = /^[a-zA-Z0-9_]{3,24}$/;
    return handleRegex.test(handle);
};

module.exports = {
    validateEmail,
    validatePassword,
    validateName,
    sanitizeInput,
    validateCodeforcesHandle
};
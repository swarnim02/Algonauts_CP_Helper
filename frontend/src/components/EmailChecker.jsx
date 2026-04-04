import React from 'react';

const EmailChecker = ({ email }) => {
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email);
        
        const commonDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'edu'];
        const domain = email.split('@')[1]?.toLowerCase();
        const isCommonDomain = commonDomains.some(d => domain?.includes(d));
        
        return { isValid, isCommonDomain };
    };

    if (!email) return null;

    const { isValid, isCommonDomain } = validateEmail(email);

    return (
        <div style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
            {isValid ? (
                <span style={{ color: '#2ecc71' }}>✓ Valid email</span>
            ) : (
                <span style={{ color: '#e74c3c' }}>✗ Invalid email format</span>
            )}
            {isValid && !isCommonDomain && (
                <div style={{ color: '#f39c12', marginTop: '0.25rem' }}>
                    ⚠ Uncommon domain - double check spelling
                </div>
            )}
        </div>
    );
};

export default EmailChecker;
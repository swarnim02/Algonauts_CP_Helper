import React from 'react';

const COMMON_DOMAINS = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'edu'];

const EmailChecker = ({ email }) => {
    if (!email) return null;

    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const domain = email.split('@')[1]?.toLowerCase();
    const isCommonDomain = COMMON_DOMAINS.some((d) => domain?.includes(d));

    return (
        <div className="field-feedback">
            {isValid ? (
                <span className="field-ok">✓ Valid email</span>
            ) : (
                <span className="field-bad">✗ Invalid email format</span>
            )}
            {isValid && !isCommonDomain && (
                <span className="field-warn">⚠ Uncommon domain — double-check the spelling</span>
            )}
        </div>
    );
};

export default EmailChecker;

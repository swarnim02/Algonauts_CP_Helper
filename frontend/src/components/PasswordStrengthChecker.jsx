import React from 'react';

const PasswordStrengthChecker = ({ password }) => {
    const checkStrength = (pwd) => {
        const checks = {
            length: pwd.length >= 8,
            uppercase: /[A-Z]/.test(pwd),
            lowercase: /[a-z]/.test(pwd),
            number: /\d/.test(pwd),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
        };
        
        const score = Object.values(checks).filter(Boolean).length;
        const strength = score < 3 ? 'weak' : score < 5 ? 'medium' : 'strong';
        
        return { checks, score, strength };
    };

    if (!password) return null;

    const { checks, strength } = checkStrength(password);
    const strengthColors = { weak: '#e74c3c', medium: '#f39c12', strong: '#2ecc71' };

    return (
        <div style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
            <div style={{ 
                color: strengthColors[strength], 
                fontWeight: 'bold',
                textTransform: 'capitalize',
                marginBottom: '0.25rem'
            }}>
                Password Strength: {strength}
            </div>
            <div style={{ color: '#666' }}>
                {!checks.length && '• At least 8 characters'}
                {!checks.uppercase && '• One uppercase letter'}
                {!checks.lowercase && '• One lowercase letter'}
                {!checks.number && '• One number'}
            </div>
        </div>
    );
};

export default PasswordStrengthChecker;
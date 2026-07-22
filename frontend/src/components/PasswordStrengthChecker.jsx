import React from 'react';

const RULES = [
    { key: 'length', label: 'At least 8 characters', test: (p) => p.length >= 8 },
    { key: 'uppercase', label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
    { key: 'lowercase', label: 'One lowercase letter', test: (p) => /[a-z]/.test(p) },
    { key: 'number', label: 'One number', test: (p) => /\d/.test(p) },
    { key: 'special', label: 'One special character', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) }
];

const PasswordStrengthChecker = ({ password }) => {
    if (!password) return null;

    const results = RULES.map((r) => ({ ...r, passed: r.test(password) }));
    const score = results.filter((r) => r.passed).length;
    const strength = score < 3 ? 'weak' : score < 5 ? 'medium' : 'strong';
    const unmet = results.filter((r) => !r.passed);

    return (
        <div className="field-feedback">
            <div className="pw-meter" aria-hidden="true">
                {RULES.map((r, i) => (
                    <span
                        key={r.key}
                        className={`pw-seg${i < score ? ` filled ${strength}` : ''}`}
                    />
                ))}
            </div>

            <div className={`pw-label ${strength}`}>
                Password strength: {strength}
            </div>

            {unmet.length > 0 && (
                <ul className="pw-rules">
                    {unmet.map((r) => (
                        <li key={r.key}>{r.label}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PasswordStrengthChecker;

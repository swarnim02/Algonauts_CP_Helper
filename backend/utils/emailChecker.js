const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    
    const commonDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'edu'];
    const domain = email.split('@')[1]?.toLowerCase();
    const isCommonDomain = commonDomains.some(d => domain?.includes(d));
    
    return {
        isValid,
        isCommonDomain,
        domain
    };
};

module.exports = { validateEmail };
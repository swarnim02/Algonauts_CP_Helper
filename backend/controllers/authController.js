const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const register = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        if (!name || !email || !password || !role || 
            typeof name !== 'string' || typeof email !== 'string' || 
            typeof password !== 'string' || typeof role !== 'string') {
            return res.status(400).json({ message: 'Please provide all fields with valid data types' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        const userExists = await User.findOne({ email: email.toLowerCase().trim() });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        if (!['mentor', 'student'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password,
            role,
            codeforcesHandle: req.body.codeforcesHandle ? req.body.codeforcesHandle.trim() : ''
        });

        const token = generateToken(res, user._id);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token
        });
    } catch (error) {
        console.error('Register error:', error.message);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address' });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordMatch = await user.matchPassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(res, user._id);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            groupIds: user.groupIds,
            token
        });
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ message: 'Server error during login' });
    }
};

const logout = async (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
    });

    res.status(200).json({ message: 'Logged out successfully' });
};

const getMe = async (req, res) => {
    try {
        const user = {
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
            groupIds: req.user.groupIds,
            codeforcesHandle: req.user.codeforcesHandle
        };

        res.status(200).json(user);
    } catch (error) {
        console.error('Get profile error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    register,
    login,
    logout,
    getMe
};

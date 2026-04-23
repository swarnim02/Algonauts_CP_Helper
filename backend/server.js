const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS
const allowedOrigins = ['https://cp-helper-rust.vercel.app', 'http://localhost:5173', 'http://localhost:3000',"http://localhost:5175"];
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Credentials', 'true');
    }
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
    res.header('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.use(express.json());
app.use(cookieParser());

// Database Connection
const connectDB = require('./config/db');
connectDB();

// Routes
app.get('/', (req, res) => {
    res.send('Algonauts API is running...');
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/mentor', require('./routes/mentor'));
app.use('/api/student', require('./routes/student'));
app.use('/api/contact', require('./routes/contact'));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

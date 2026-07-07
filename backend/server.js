const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config();

const connectDB = require('./config/db');
const { securityHeaders, requestSizeLimit } = require('./middleware/security');
const { apiLimiter } = require('./middleware/rateLimiter');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// Fail fast on missing configuration rather than at first request
const requiredEnv = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (missingEnv.length) {
    console.error(`Missing required environment variables: ${missingEnv.join(', ')}`);
    console.error('Copy backend/.env.example to backend/.env and fill it in.');
    process.exit(1);
}

// Allowed origins come from CORS_ORIGINS (comma separated); dev defaults keep local work friction-free
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(securityHeaders);
app.use(cors({
    origin(origin, callback) {
        // Allow non-browser clients (curl, Postman, server-to-server) which send no Origin
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(requestSizeLimit);
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

connectDB();

app.get('/', (req, res) => {
    res.send('Algonauts API is running...');
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

app.use('/api', apiLimiter);
app.use('/api/auth', require('./routes/auth'));
app.use('/api/mentor', require('./routes/mentor'));
app.use('/api/student', require('./routes/student'));
app.use('/api/codeforces-stats', require('./routes/codeforcesStats'));
app.use('/api/contact', require('./routes/contact'));

// Error handling must be registered after all routes
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

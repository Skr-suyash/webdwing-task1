const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
require('./db');

// Routers
const mainRouter = require('../routers/mainRouter');
const authRouter = require('../routers/authRouter');
const userRouter = require('../routers/userRouter');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,
    message: 'Too many requests from this IP'
});
app.use(limiter);

app.use(mainRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);

// Routes
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
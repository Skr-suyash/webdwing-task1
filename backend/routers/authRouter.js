const express = require('express');
const userModel = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    console.log(email, password, name)
    try {
        const exists = await userModel.findOne({ email: email });
        if (exists) {
            return res.status(400).json({ error: 'user already exists!' });
        }
        const hash = await bcrypt.hash(password, 10);
        const user = {
            name: name,
            email: email,
            password: hash,
        };
        await userModel.insertOne(user);
        res.status(200).json(user);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body; 
    const user = await userModel.findOne({ email: email });
    if (!user) {
        return res.status(400).json({ error: 'User not found!' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ error: 'Wrong password!' });
    }

    const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET_KEY, { expiresIn: '1h'});
    res.json({
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        },
        token: token
    });
});

router.get('/profile', verifyToken, async (req, res) => {
    console.log(req);
    
    try {
        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found!' });
        }
        res.json({
            id: user._id,
            name: user.name,
            email: user.email
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/logout', verifyToken, (req, res) => {
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;
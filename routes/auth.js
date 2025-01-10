const express = require('express');  
const bcrypt = require('bcryptjs');  
const User = require('../models/user');  
const { body, validationResult } = require('express-validator');  

const router = express.Router();  

// Protected route  
const authMiddleware = require('../middleware/authMiddleware.js');  

router.get('/api/protected', authMiddleware, (req, res) => {  
    res.json({ message: 'This is a protected route.', userId: req.user.userId });  
});  

// User Registration Route  
router.post('/register',  
    body('username').notEmpty().withMessage('Username is required'),  
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),  
    async (req, res) => {  
        const errors = validationResult(req);  
        if (!errors.isEmpty()) {  
            return res.status(400).json({ errors: errors.array() });  
        }  

        const { username, password } = req.body;  

        try {  
            const existingUser = await User.findOne({ username });  
            if (existingUser) {  
                return res.status(400).json({ message: 'User already exists' });  
            }  

            const hashedPassword = await bcrypt.hash(password, 10);  
            const newUser = new User({ username, password: hashedPassword });  
            await newUser.save();  

            res.status(201).json({ message: 'User registered successfully' });  
        } catch (error) {  
            console.error('Error registering user:', error);  
            res.status(500).json({ message: 'Internal Server Error' });  
        }  
    }  
);  

// User Login Route  
router.post('/login', async (req, res) => {  
    const { username, password } = req.body;  

    try {  
        const user = await User.findOne({ username });  
        if (!user) {  
            return res.status(400).json({ message: 'Invalid credentials' });  
        }  

        const isPasswordValid = await bcrypt.compare(password, user.password);  
        if (!isPasswordValid) {  
            return res.status(400).json({ message: 'Invalid credentials' });  
        }  

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });  
        res.status(200).json({ token });  
    } catch (error) {  
        console.error('Error logging in user:', error);  
        res.status(500).json({ message: 'Internal Server Error' });  
    }  
});  

// User Logout Route  
router.post('/logout', (req, res) => {  
    // Client should delete token on logout  
    res.status(200).json({ message: 'User logged out successfully' });  
});  

module.exports = router;
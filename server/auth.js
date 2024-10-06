const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('./models/user');  // Adjust the path to your User model
const router = express.Router();
const crypto = require('crypto');
// Secret key for JWT
const JWT_SECRET = '1c44aadf4f81ceb5e14d5c6bf219bb884ac086a52f190e1534a04c37e95e98a5';  // Ensure this matches the one in .env

// Registration route
// Registration route without password hashing
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user with plain text password
        const newUser = new User({
            username,
            password  // No hashing, saving the plain text password
        });

        // Save the user in the database
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Server error during registration' });
    }
});



// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log({ username, password });  // Ensure these values are correct
    console.log('Received username:', req.body.username);
    console.log('Received password:', req.body.password);
    try {
        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            console.log('User not found:', username);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare the entered password with the stored plain text password
        if (user.password !== password) {
            console.log('Password does not match');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '1h' });

        console.log('Login successful:', { username });
        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }
});



module.exports = router;

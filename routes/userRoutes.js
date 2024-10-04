const express = require('express');
const { registerUser, loginUser, forgotPassword, resetPassword, getProfile  } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Authenticated routes
router.get('/getProfile', authMiddleware.protect, getProfile);

// Check authentication
router.get('/isAuthenticated', authMiddleware.protect, (req, res) => {
    if (req.user) {
        res.status(200).json({ isAuthenticated: true, user: req.user });
    } else {
        res.status(200).json({ isAuthenticated: false });
    }
});

// Logout route
router.post('/logout', authMiddleware.protect, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        res.status(200).json({ msg: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

const express = require('express');
const { registerAdmin, loginAdmin, forgotPassword, resetPassword  } = require('../controllers/adminController');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

// Public routes
router.post('/admin/register', registerAdmin);
router.post('/admin/login', loginAdmin);
router.post('/admin/forgot-password', forgotPassword);
router.post('/admin/reset-password', resetPassword);


// Check authentication
router.get('/admin/isAuthenticated', adminMiddleware.protect, (req, res) => {
    if (req.admin) {
        res.status(200).json({ isAuthenticated: true, admin: req.admin });
    } else {
        res.status(200).json({ isAuthenticated: false });
    }
});

// Logout route
router.post('/admin/logout', adminMiddleware.protect, async (req, res) => {
    try {
        if (!req.admin) {
            return res.status(401).json({ message: 'Admin not authenticated' });
        }
        res.status(200).json({ msg: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

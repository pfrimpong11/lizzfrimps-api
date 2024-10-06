// routes/cartRoutes.js
const express = require('express');
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware to authenticate user

const router = express.Router();

// Fetch cart items for the logged-in user
router.get('/cart', authMiddleware.protect, cartController.getCartItems);

// Add item to cart
router.post('/cart/add', authMiddleware.protect, cartController.addItemToCart);

// Update item in cart
router.put('/cart/update', authMiddleware.protect, cartController.updateItemInCart);

// Remove item from cart
router.delete('/cart/remove', authMiddleware.protect, cartController.removeCartItem);

// delete item from cart
router.delete('/cart/delete', authMiddleware.protect, cartController.deleteCart);

module.exports = router;

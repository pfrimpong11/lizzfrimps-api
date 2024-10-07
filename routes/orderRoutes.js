const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require('../middleware/authMiddleware'); // Middleware to authenticate user

// Route to save the order
router.post("/order/save",  orderController.saveOrder);

module.exports = router;

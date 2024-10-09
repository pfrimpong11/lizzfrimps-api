const express = require("express");
const router = express.Router();
const { saveOrder, getAllOrders, filterOrdersByDate, updateOrderStatus, deleteOrder } = require("../controllers/orderController");
const authMiddleware = require('../middleware/authMiddleware'); // Middleware to authenticate user

// Route to save the order
router.post("/order/save", saveOrder);

// Route to get all orders
router.get("/admin/orders", getAllOrders);

// Route to filter orders by delivery date
router.get("/admin/orders/filter", filterOrdersByDate);

// Route to update order status
router.put("/admin/orders/update-status", updateOrderStatus);

// Route to delete an order
router.delete("/admin/orders/:orderId", deleteOrder);

module.exports = router;

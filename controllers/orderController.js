const Order = require("../models/orderModel"); // Import your Order model
const User = require('../models/user');
const nodemailer = require("nodemailer"); // Import nodemailer for sending emails

// Function to generate a unique order ID
const generateOrderId = (username) => {
  const timestamp = Date.now(); // Current timestamp in milliseconds
  const randomNumber = Math.floor(1000 + Math.random() * 9000); // Generate a random 4-digit number
  return `${username}-${timestamp}-${randomNumber}`; // Concatenate username, timestamp, and random number
};

// Controller to save order
exports.saveOrder = async (req, res) => {
  const { userId, cartItems, totalPrice, deliveryMethod, location, inscription, deliveryDate, email } = req.body;
  
  try {
    // Fetch user info (like username) from the database if not passed in the request
    const user = await User.findById(userId);
    const username = user.username; // Assuming the user's name is used as the username
    
    // Generate a unique order ID using the username
    const orderId = generateOrderId(username);
    
    // Save order in the database
    const newOrder = new Order({
      orderId, // Store the unique order ID
      userId,
      items: cartItems,
      totalPrice,
      deliveryMethod,
      location,
      inscription,
      deliveryDate,
      status: "Pending", // Initial status for the order
    });

    await newOrder.save();

    // Send confirmation email
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use your preferred email service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Lizzfrimps Cakes Empire" <${process.env.EMAIL_USER}>`,
      to: email, // Send email to user's email
      subject: "Order Confirmation - Lizzfrimps Cakes Empire",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
          <!-- Header -->
          <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; font-weight: bold;">Order Confirmation</h1>
          </div>
          <!-- Body -->
          <div style="padding: 20px; background-color: #f9f9f9;">
            <p style="font-size: 16px; color: #333;">Hello,</p>
            <p style="font-size: 16px; color: #333;">Thank you for your order! We are excited to process your request and get your delicious cake(s) ready.</p>
            <p style="font-size: 16px; color: #333;"><strong>Order ID:</strong> ${orderId}</p>
            <p style="font-size: 16px; color: #333;"><strong>Delivery/Pickup Date:</strong> ${deliveryDate}</p>
            <p style="font-size: 16px; color: #333;">We will keep you updated with the status of your order. If you have any questions, feel free to reach out to us at any time.</p>
            <p style="font-size: 16px; color: #333;">Thank you for choosing Lizzfrimps Cakes Empire!</p>
            <p style="font-size: 16px; color: #333;">Best regards,<br>The Lizzfrimps Cakes Empire Team</p>
          </div>
          <!-- Footer -->
          <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 14px; color: #777;">
            <p style="margin: 0;">© 2024 Lizzfrimps Cakes Empire. All rights reserved.</p>
            <p style="margin: 0;">7th Adote Obour St, Accra, Ghana</p>
            <p style="margin: 0;"><a href="#" style="color: #4CAF50; text-decoration: none;">Unsubscribe</a> | <a href="#" style="color: #4CAF50; text-decoration: none;">Contact Us</a></p>
          </div>
        </div>
      `,
    };
    
    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Order saved successfully, confirmation email sent", orderId });
  } catch (err) {
    res.status(500).json({ message: "Failed to save order or send email", error: err });
  }
};




// Controller to get all orders (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("userId"); // Populate user info
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

// Controller to filter orders by delivery date (Admin)
exports.filterOrdersByDate = async (req, res) => {
  const { deliveryDate } = req.query; // Get date from query parameters
  try {
    const orders = await Order.find({ deliveryDate: new Date(deliveryDate) }).populate("userId");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error filtering orders", error });
  }
};

// Controller to update order status (Admin)
exports.updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body; // Get order ID and new status from request body
  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      { status },
      { new: true } // Return the updated order
    );
    res.status(200).json({ message: "Order status updated", updatedOrder });
  } catch (error) {
    res.status(500).json({ message: "Error updating order status", error });
  }
};

// Controller to delete an order (Admin)
exports.deleteOrder = async (req, res) => {
  const { orderId } = req.params; // Get order ID from route parameters
  try {
    await Order.findOneAndDelete({ orderId });
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting order", error });
  }
};

// orderController.js
const Order = require("../models/orderModel"); // Import your Order model
const nodemailer = require("nodemailer"); // Import nodemailer for sending emails

// Controller to save order
exports.saveOrder = async (req, res) => {
  const { userId, cartItems, totalPrice, deliveryMethod, location, deliveryDate } = req.body;
  try {
    // Save order in the database
    const newOrder = new Order({
      userId,
      items: cartItems,
      totalPrice,
      deliveryMethod,
      location,
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
      from: process.env.EMAIL_USER,
      to: req.body.email, // Send email to user's email
      subject: "Order Confirmation",
      text: `Thank you for your order! We have received it and will process it soon. Your delivery/pickup is scheduled for: ${deliveryDate}.`, // Email content
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Order saved successfully, confirmation email sent" });
  } catch (err) {
    res.status(500).json({ message: "Failed to save order or send email", error: err });
  }
};

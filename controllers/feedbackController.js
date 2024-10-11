// controllers/feedbackController.js
const Feedback = require('../models/feedback');
const nodemailer = require('nodemailer');

exports.submitFeedback = async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    // Save feedback to the database
    const feedback = new Feedback({ name, email, subject, message });
    await feedback.save();

    // Send acknowledgment email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"Lizzfrimps Cakes Empire" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Thank You for Your Feedback - Lizzfrimps Cakes Empire',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
            <!-- Header -->
            <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">Thank You for Your Feedback!</h1>
            </div>
            <!-- Body -->
            <div style="padding: 20px; background-color: #f9f9f9;">
              <p style="font-size: 16px; color: #333;">Dear <strong>${name}</strong>,</p>
              <p style="font-size: 16px; color: #333;">We sincerely appreciate you taking the time to provide feedback on our website, Lizzfrimps Cakes Empire.</p>
              <p style="font-size: 16px; color: #333;">Our team will carefully review your message and get back to you shortly if needed. Your input helps us improve and continue delivering great experiences.</p>
              <p style="font-size: 16px; color: #333;">In the meantime, feel free to contact us if you have any additional questions, concerns, or suggestions.</p>
              <p style="font-size: 16px; color: #333;">Thank you for being part of the Lizzfrimps Cakes Empire family!</p>
              <p style="font-size: 16px; color: #333; font-style: italic;">Best regards,<br>The Lizzfrimps Cakes Empire Team</p>
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

    // Send response
    res.status(200).json({ message: 'Feedback submitted successfully. Acknowledgment email sent.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error submitting feedback' });
  }
};



// Get all feedback
exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find(); // Fetch all feedbacks
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving feedbacks', error });
  }
};

// Delete a specific feedback
exports.deleteFeedback = async (req, res) => {
  const feedbackId = req.params.id;
  try {
    await Feedback.findByIdAndDelete(feedbackId); // Find feedback by ID and delete
    res.status(200).json({ message: 'Feedback deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting feedback', error });
  }
};
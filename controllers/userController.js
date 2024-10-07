// controllers/userController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/user');
const Order = require('../models/orderModel');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};


exports.registerUser = async (req, res) => {
  const { username, name, email, phone, password } = req.body;

  try {
    let user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({ msg: 'User with this username already exists' });
    }

    user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User with this email already exists' });
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      username,
      name,
      email,
      phone,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid username or password' });
    }

    res.json({
      _id: user._id,
      username: user.username,
      token: generateToken(user._id)
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });


    const mailOptions = {
      from: `"Lizzfrimps Cakes Empire" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Password Reset Request - Lizzfrimps Cakes Empire',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
          <!-- Header -->
          <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; font-weight: bold;">Password Reset Request</h1>
          </div>
          <!-- Body -->
          <div style="padding: 20px; background-color: #f9f9f9;">
            <p style="font-size: 16px; color: #333;">Hello <strong>${user.name}</strong>,</p>
            <p style="font-size: 16px; color: #333;">We received a request to reset your password. Please click the button below to reset your password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/ResetPasswordPage?token=${token}" 
                 style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 5px; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p style="font-size: 16px; color: #333;">If you did not request this, please disregard this email. Your password will remain unchanged, and no further action is required.</p>
            <p style="font-size: 16px; color: #333;">Best regards,<br>The Lizzfrimps Cakes Empire Team</p>
          </div>
          <!-- Footer -->
          <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 14px; color: #777;">
            <p style="margin: 0;">© 2024 Lizzfrimps Cakes Empire. All rights reserved.</p>
            <p style="margin: 0;">7th Adote Obour st, Accra, Ghana</p>
            <p style="margin: 0;"><a href="#" style="color: #4CAF50; text-decoration: none;">Unsubscribe</a> | <a href="#" style="color: #4CAF50; text-decoration: none;">Contact Us</a></p>
          </div>
        </div>
      `,
    };
    

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email: ', error);
        return res.status(500).json({ msg: 'Error sending email' });
      }
      res.status(200).json({ msg: 'Password reset email sent' });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ msg: 'Invalid token or user does not exist' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();
    res.status(200).json({ msg: 'Password reset successful' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};



// exports.getProfile = async (req, res) => {
//   const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ msg: 'No token, authorization denied' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id).select('-password');
    
//     if (!user) {
//       return res.status(404).json({ msg: 'User not found' });
//     }

//     res.status(200).json(user);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// };


// Get user's full profile along with their order history
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you're using middleware to extract authenticated user ID

    // Fetch the user's profile
    const userProfile = await User.findById(userId).select('-password'); // Exclude sensitive fields like password

    // Fetch user's order history
    const orderHistory = await Order.find({ userId });

    // Combine user profile and order history
    const fullProfile = {
      userProfile,
      orderHistory
    };

    res.status(200).json(fullProfile);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

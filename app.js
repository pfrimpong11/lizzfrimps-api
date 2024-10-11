const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const session = require('express-session');
const cors = require("cors");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// CORS middleware
app.use(cors());

// Middleware for parsing JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));  // For form submissions

// Use the secret key from the environment variable
const sessionSecret = process.env.SESSION_SECRET;

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set secure to true if using HTTPS
}));

// API routes
app.use('/api', require('./routes/userRoutes'));
app.use('/api', require('./routes/cakeRoutes'));
app.use('/api', require('./routes/cartRoutes'));
app.use('/api', require('./routes/orderRoutes'));
app.use('/api', require('./routes/feedbackRoutes'));


// Admin route
app.use('/api', require('./routes/adminRoutes'));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server started on port ${PORT}`));

// app.js
const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const cors = require("cors");



dotenv.config();
connectDB();

const app = express();

// CORS middleware
app.use(cors());

app.use(bodyParser.json());

// Use the secret key from the environment variable
const sessionSecret = process.env.SESSION_SECRET;

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));


// API routes
app.use('/api', require('./routes/userRoutes'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

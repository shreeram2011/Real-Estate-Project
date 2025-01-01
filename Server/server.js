require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const zod = require('zod');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs'); // Using bcrypt for password hashing
const crypto = require('crypto');
const cors = require('cors');

const port = process.env.PORT || 5000;

const app = express();

// Middleware and configuration
app.use(cors());
app.use(express.json());

// JWT Verification Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ msg: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use the JWT secret from .env
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ msg: 'Invalid or expired token' });
  }
};

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Mongoose Schema & Model
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  contact: String,
  userType: String, // Added userType field
  verified: { type: Boolean, default: false },
  otp: { type: String, default: null },
  otpExpiry: { type: Date, default: null },
});

const User = mongoose.model('User', UserSchema);

// Validation Schemas with Zod
const emailSchema = zod.string().email();
const passwordSchema = zod.string().min(8);
const contactSchema = zod
  .string()
  .regex(/^\+\d{1,3}\d{10}$/, "Contact number must include country code and be 10 digits long (e.g., +911234567890)");

// Nodemailer Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  port: 465,
  auth: {
    user: process.env.EMAIL_USER, // Use email from .env
    pass: process.env.EMAIL_PASS, // Use password from .env
  },
});

// Helper Functions
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10); // bcrypt to hash password
};

const comparePassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword); // bcrypt to compare password
};

// Register Endpoint
app.post('/register', async (req, res) => {
  const { name, email, password, contact, userType } = req.body;

  // Validation
  try {
    emailSchema.parse(email);
    passwordSchema.parse(password);
    contactSchema.parse(contact);
  } catch (err) {
    return res.status(400).json({ msg: 'Invalid input data', error: err.errors });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ msg: 'User already exists' });
  }

  // Generate OTP and hash password
  const otp = generateOTP();
  const hashedPassword = hashPassword(password);

  // Save user with OTP and hashed password
  const newUser = new User({ name, email, password: hashedPassword, contact, userType, otp });
  await newUser.save();

  // Send OTP via Email
  const mailOptions = {
    from: process.env.EMAIL_USER, // Use email from .env
    to: email,
    subject: 'Email Verification OTP',
    text: `Your OTP is ${otp}`,
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ msg: 'Failed to send OTP', error: err.message });
    }
    res.status(200).json({ msg: 'User registered. OTP sent to email for verification.' });
  });
});

// Verify OTP Endpoint
app.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.otp !== otp) {
    return res.status(400).json({ msg: 'Invalid OTP' });
  }

  // Mark user as verified and clear OTP
  user.verified = true;
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  res.status(200).json({ msg: 'OTP verified successfully' });
});

// Resend OTP Endpoint
app.post('/resend-otp', async (req, res) => {
  const { email } = req.body;

  // Check if the user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ msg: 'User not found' });
  }

  // Check if the user is already verified
  if (user.verified) {
    return res.status(400).json({ msg: 'User already verified' });
  }

  // Generate a new OTP and update the user
  const otp = generateOTP();
  user.otp = otp;
  user.otpExpiry = new Date(Date.now() + 3600000); // OTP valid for 1 hour
  await user.save();

  // Send the new OTP via email
  const mailOptions = {
    from: process.env.EMAIL_USER, // Use email from .env
    to: email,
    subject: 'Resend OTP - Email Verification',
    text: `Your new OTP is ${otp}. It is valid for 1 hour.`,
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ msg: 'Failed to send OTP', error: err.message });
    }
    res.status(200).json({ msg: 'OTP resent to email' });
  });
});

// Login Endpoint
app.post('/login', async (req, res) => {
  const { email, password, userType } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ msg: 'User not found' });
  }

  if (!comparePassword(password, user.password)) {
    return res.status(401).json({ msg: 'Incorrect password' });
  }

  if (!user.verified) {
    return res.status(403).json({ msg: 'Email not verified. Please verify first.' });
  }

  // Generate JWT Token
  const token = jwt.sign({ email: user.email, name: user.name, userType: user.userType }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  // Set token in response headers
  res.setHeader('Authorization', `Bearer ${token}`);

  res.status(200).json({ 
    msg: 'Login successful', 
    token,
    name: user.name,
    isLoggedIn: true,
    userName: user.name,
    userType: user.userType
  });
});

// Protected Route Example
app.get('/protected', verifyToken, (req, res) => {
  res.json({ msg: 'Access granted', user: req.user });
});

// Forgot Password Endpoint
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ msg: 'User not found' });
  }

  // Generate OTP
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 3600000); // OTP valid for 1 hour

  user.otp = otp;
  user.otpExpiry = otpExpiry;
  await user.save();

  // Send OTP via Email
  const mailOptions = {
    from: process.env.EMAIL_USER, // Use email from .env
    to: email,
    subject: 'Password Reset OTP',
    text: `Your password reset OTP is ${otp}. It is valid for 1 hour`,
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ msg: 'Failed to send OTP', error: err.message });
    }
    res.status(200).json({ msg: 'OTP sent to email for password reset' });
  });
});

// Reset Password Endpoint
app.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.otp !== otp || user.otpExpiry < new Date()) {
    return res.status(400).json({ msg: 'Invalid or expired OTP' });
  }

  // Update password
  user.password = hashPassword(newPassword);
  user.otp = null; // Clear the OTP after use
  user.otpExpiry = null;
  await user.save();

  res.status(200).json({ msg: 'Password reset successful' });
});

// Start the Server
app.listen(port, () => {
  console.log('Server is running on port 5000');
});

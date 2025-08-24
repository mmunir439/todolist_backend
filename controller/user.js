const User=require("../model/user");
const jwt = require('jsonwebtoken');
const { generateToken } = require('../utils/jwt');
const {hashPassword,comparePassword}=require('../utils/hash');
const { sendEmail } = require('../utils/email');
const bcrypt = require('bcrypt');
exports.registeruser = async (req, res) => {
  try {
    const { username, email, password, cnic } = req.body;

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create a new user
    const newUser = new User({ username, email, password: hashedPassword, cnic });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Send welcome email
    await sendEmail(
      email,
      "Welcome to Todolist App",
      `
      <div style="max-width:600px;margin:auto;padding:20px;background:#f9f9f9;border-radius:8px;font-family:sans-serif;">
        <h1 style="color:#2d6cdf;text-align:center;">Welcome, ${username}!</h1>
        <p style="font-size:16px;color:#333;">Your registration was successful.</p>
        <p style="font-size:16px;color:#333;">This application will help you manage your tasks efficiently.</p>
        <p style="font-size:16px;color:#333;">You can create, update, and track your to-do tasks easily.</p>
        <p style="font-size:16px;color:#333;">
          If you have any questions, feel free to contact our support team or visit 
          <a href="https://munir-portfolio-iota.vercel.app/" style="color:#2d6cdf;">this link</a>.
        </p>
        <p style="font-size:16px;color:#333;">Thank you for joining us!</p>
        <div style="text-align:center;margin-top:30px;">
          <a href="https://munir-portfolio-iota.vercel.app/" style="background:#2d6cdf;color:#fff;padding:10px 20px;border-radius:5px;text-decoration:none;">Visit Our Website</a>
        </div>
      </div>
      `
    );

    // Send the saved user in the response
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.loginuser = async (req, res, next) => { 
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "please go and register because you don't have account" });
    }
    const isMatch = await comparePassword(password, user.password);
    if (isMatch) {
      const payload = {
        userId: user._id,
        email: user.email,
        username: user.username,
        cnic: user.cnic // Include cnic here
      };
      console.log("Payload before generating token:", payload);

      const token = generateToken(payload);
      // Send token and user information in the response
      return res.json({
        message: "login successfully",
        token,
        user: {
          userId: user._id,
          email: user.email,
          username: user.username,
          cnic: user.cnic
        }
      });
    } else {
      return res.json({ message: "invalid email or password" });
    }
  } catch (error) {
    next(error);
  }
};
exports.getuser = async (req, res, next) => {
  try {
    console.log(req.user); // Debugging: Check if req.user contains cnic
    if (!req.user || !req.user.cnic) {
      return res.status(400).json({ error: "CNIC is missing in the token" });
    }
    const seeuserdetails = await User.find({ cnic: req.user.cnic });
    if (!seeuserdetails.length) {
      return res.status(404).json({ error: "No user found with this CNIC" });
    }
    res.status(200).json(seeuserdetails);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.updateuser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body; // Extract email from the request body
    const updatedUser = await User.findOneAndUpdate(
      { email }, // Use email from the request body
      { username, email, password },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    } else {
      return res.status(200).json({ message: "User updated successfully" });
    }
  } catch (error) {
    next(error);
  }
};
exports.deleteuser = async (req, res, next) => {
  try {
    const email = req.user.email; // Extract email from the token
    if (!email) {
      return res.status(400).json({ error: "Email is missing in the token" });
    }

    const deletedUser = await User.findOneAndDelete({ email });
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User with this email does not exist." });
    }

    // Generate a reset token (e.g., JWT or random string)
    const resetToken = generateToken({ userId: user._id }, '1h'); // Token valid for 1 hour

    // Send reset email
    await sendEmail(
      email,
      "Password Reset Request",
      `
      <div style="max-width:600px;margin:auto;padding:20px;background:#f9f9f9;border-radius:8px;font-family:sans-serif;">
        <h1 style="color:#2d6cdf;text-align:center;">Password Reset Request</h1>
        <p style="font-size:16px;color:#333;">We received a request to reset your password.</p>
        <p style="font-size:16px;color:#333;">Click the link below to reset your password:</p>
        <div style="text-align:center;margin-top:20px;">
          <a href="http://localhost:3000/reset-password?token=${resetToken}" style="background:#2d6cdf;color:#fff;padding:10px 20px;border-radius:5px;text-decoration:none;">Reset Password</a>
        </div>
        <p style="font-size:16px;color:#333;margin-top:20px;">If you did not request this, please ignore this email.</p>
      </div>
      `
    );

    res.status(200).json({ message: "Password reset email sent successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "Invalid or expired token." });
    }

    // Hash the new password and update it
    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
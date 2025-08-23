const jwt = require('jsonwebtoken');
require('dotenv').config();
exports.requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('Authorization header:', authHeader);
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  console.log('Authorization header:', authHeader);
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded payload:', decoded); // <-- This will show the payload
    req.user = decoded; // Attach user info to request
    next();
  } catch (err) {
    console.error('Error verifying token:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
    next(err);
  }
};
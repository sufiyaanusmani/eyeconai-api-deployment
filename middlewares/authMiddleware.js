// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

// Middleware to check if the user has the required role
exports.authorizeRole = (requiredRole) => (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access token missing' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== requiredRole) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }

    // Attach user info to request object
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

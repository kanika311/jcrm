const jwt = require('jsonwebtoken');

// 1. Verify if the user has a valid Token (Logged In)
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ message: 'Access Denied. No valid token provided.' });
  }

  const token = authHeader.split(' ')[1]; // Extracts the token string

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attaches the user's ID and Role to the request
    next(); // Lets them pass to the actual route
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or Expired Token' });
  }
};

// 2. Check if the user has the correct Role
const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access Denied. You do not have permission for this action.' });
    }
    next();
  };
};

module.exports = { verifyToken, authorizeRole };

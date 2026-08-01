const jwt = require('jsonwebtoken');

// This middleware runs before protected routes.
// It checks the JWT token and attaches the decoded user info to req.user
module.exports = function authMiddleware(req, res, next) {
  // Expect header format: 'Authorization: Bearer <token>'
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided. Access denied.' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided. Access denied.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id: '...', username: '...' }
    next(); // continue to the route handler
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

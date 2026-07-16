const jwt = require('jsonwebtoken');

// Protects any route it's attached to. Expects the frontend to send:
// Authorization: Bearer <token>
// (this is handled automatically by the React axios request interceptor)
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1]; // "Bearer <token>" -> take the token part

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // attach user id to request for use in controllers
    next(); // token valid — proceed to the actual route handler
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = verifyToken;

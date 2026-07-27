const jwt = require('jsonwebtoken');
const User = require('../models/User'); // adjust path if needed

const ACCESS_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 1 * 60 * 1000, // 1 minutes
};

async function verifyToken(req, res, next) {
  const accessToken = req.cookies?.accessToken;
  const refreshToken = req.cookies?.refreshToken;

  if (!accessToken) {
    return tryRefresh();
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    return attachUserAndProceed(decoded.id);
  } catch (error) {
    if (error.name !== 'TokenExpiredError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    return tryRefresh();
  }

  async function tryRefresh() {
    if (!refreshToken) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      const newAccessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, {
        expiresIn: '1m',
      });
      res.cookie('accessToken', newAccessToken, ACCESS_TOKEN_COOKIE_OPTIONS);

      return attachUserAndProceed(decoded.id);
    } catch (refreshError) {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
  }

  async function attachUserAndProceed(userId) {
    try {
      const user = await User.findById(userId).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'User no longer exists' });
      }
      req.userId = user._id;
      req.user = user; // now req.user.role is available for verifyRoles
      return next();
    } catch (dbError) {
      return res.status(500).json({ message: 'Server error', error: dbError.message });
    }
  }
}

module.exports = verifyToken;
const express = require('express');
const verifyToken = require('../../middleware/verifyToken');
const router = express.Router();

const verifyRoles = (requiredRoles = []) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        message: 'User role not found on request — check that verifyToken populates req.user.role',
      });
    }

    const userRole = req.user.role;

    if (requiredRoles.includes(userRole)) {
      return next(); // user has the required role, proceed
    }

    return res.status(403).json({
      message: 'Forbidden: You do not have the required role to access this route.',
    });
  };
};

router.get('/', verifyToken, verifyRoles(['admin']), (req, res) => {
  res.json({ message: 'Admin has the required role to access this route.' });
});

module.exports = router;
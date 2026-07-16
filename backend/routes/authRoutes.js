const express = require('express');
const router = express.Router();
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
} = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');

router.post('/register', register);
router.post('/login', login);
router.post('/forget-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Protected route — verifyToken runs first; only reaches getProfile if token is valid
router.get('/profile', verifyToken, getProfile);

module.exports = router;

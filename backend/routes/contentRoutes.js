const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const { getHomeContent, getAboutContent } = require('../controllers/contentController');

const router = express.Router();

router.get('/home', verifyToken, getHomeContent);
router.get('/about', verifyToken, getAboutContent);

module.exports = router;
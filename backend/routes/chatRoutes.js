const express = require('express');
const protect = require('../../config/middleware/authMiddleware');
const { processChat } = require('../controllers/chatController');

const router = express.Router();

router.post('/chat', protect, processChat);

module.exports = router;
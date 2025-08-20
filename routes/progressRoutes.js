const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../controllers/authController.js');
const { updateProgress, getProgress } = require('../controllers/progressController.js');

// Foydalanuvchi progressini yangilash
router.post('/update-progress', authenticateJWT, updateProgress);

// Foydalanuvchi progressini olish
router.get('/get-progress', authenticateJWT, getProgress);

module.exports = router;
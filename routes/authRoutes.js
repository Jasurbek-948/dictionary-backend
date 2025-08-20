const express = require('express');
const router = express.Router();
const { userRegister, userLogin, adminRegister, adminLogin, uploadProfileImage, authenticateJWT } = require('../controllers/authController.js');
const { validateUser, validateAdmin } = require('../middleware/validate.js');

// Foydalanuvchi ro‘yxatdan o‘tishi
router.post('/user/register', validateUser, userRegister);

// Foydalanuvchi tizimga kirishi
router.post('/user/login', validateUser, userLogin);

// Admin ro‘yxatdan o‘tishi
router.post('/admin/register', validateAdmin, adminRegister);

// Admin tizimga kirishi
router.post('/admin/login', validateAdmin, adminLogin);

// Profil rasmini yuklash (JWT bilan himoyalangan)
router.post('/upload-profile-image', authenticateJWT, uploadProfileImage);

module.exports = router;
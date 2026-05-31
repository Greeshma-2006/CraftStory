const express = require('express');

const router = express.Router();

const {
  register,
  login,
  getMe,
  updateProfile,
  deleteAccount,
  forgotPassword,
  resetPassword,
  verifyAdminLogin,
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');

// PUBLIC
router.post('/register', register);
router.post('/login', login);

// ADMIN VERIFY
router.get('/admin/verify-login/:token', verifyAdminLogin);

// PASSWORD
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

// PROTECTED
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.delete('/account', protect, deleteAccount);

module.exports = router;
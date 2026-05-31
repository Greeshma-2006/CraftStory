const express = require('express');
const router = express.Router();
const {
  createRazorpayOrder,
  verifyPayment,
  getRazorpayKey
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/create-order', createRazorpayOrder);
router.post('/verify', verifyPayment);
router.get('/razorpay-key', getRazorpayKey);

module.exports = router;
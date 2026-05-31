const razorpayInstance = require('../config/razorpay');
const crypto = require('crypto');

// CREATE RAZORPAY ORDER
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    const options = {
      amount:          Math.round(amount * 100), // paise — must be integer
      currency:        'INR',
      receipt:         `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpayInstance.orders.create(options);

    // Return response with field names that match the frontend exactly
    res.status(200).json({
      success: true,
      order: {
        id:       order.id,       // Razorpay order id
        amount:   order.amount,   // amount in paise
        currency: order.currency,
      },
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// VERIFY RAZORPAY PAYMENT
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment details' });
    }

    const body             = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSig      = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(body)
      .digest('hex');
    const isAuthentic      = expectedSig === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified',
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET RAZORPAY KEY (for frontend)
exports.getRazorpayKey = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

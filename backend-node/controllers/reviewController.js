const Review  = require('../models/Review');
const Product = require('../models/Product');
const Order   = require('../models/Order');

// ======================
// ADD REVIEW
// ======================

exports.addReview = async (req, res) => {
  try {
    const { rating, review, orderId } = req.body;
    const productId = req.params.productId;

    if (!orderId) {
      return res.status(400).json({ success: false, message: 'orderId is required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Verify this order belongs to this customer and contains this product
    const order = await Order.findOne({
      _id:      orderId,
      customer: req.user._id,
      'products.product': productId,
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        message: 'You can only review products from your own delivered orders',
      });
    }

    if (order.orderStatus !== 'Delivered') {
      return res.status(400).json({
        success: false,
        message: 'You can only review products from delivered orders',
      });
    }

    // Check duplicate — one review per user+product+order combination
    const existingReview = await Review.findOne({
      product: productId,
      user:    req.user._id,
      order:   orderId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You already reviewed this product for this order',
      });
    }

    const newReview = await Review.create({
      product: productId,
      user:    req.user._id,
      order:   orderId,
      rating,
      review,
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data:    newReview,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================
// GET REVIEWS
// ======================

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    const totalReviews   = reviews.length;
    let   averageRating  = 0;

    if (totalReviews > 0) {
      averageRating = reviews.reduce((total, item) => total + item.rating, 0) / totalReviews;
    }

    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => { ratingDistribution[r.rating]++; });

    res.status(200).json({
      success: true,
      totalReviews,
      averageRating:       Number(averageRating.toFixed(1)),
      ratingDistribution,
      data:                reviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Product',
      required: true,
    },

    // orderId — allows one review PER ORDER of the same product
    // A customer who buys same product 4 times gets 4 separate review slots
    order: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Order',
      required: true,
    },

    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },

    rating: {
      type:     Number,
      required: true,
      min:      1,
      max:      5,
    },

    review: {
      type:     String,
      required: true,
      trim:     true,
    },
  },
  { timestamps: true }
);

// Unique per user+product+order combination — one review per order line
reviewSchema.index({ product: 1, user: 1, order: 1 }, { unique: true });

module.exports = mongoose.models.Review || mongoose.model('Review', reviewSchema);

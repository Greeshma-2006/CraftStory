const express =
  require('express');

const router =
  express.Router();

const {
  protect,
} = require(
  '../middleware/auth'
);

const {
  addReview,
  getReviews,
} = require(
  '../controllers/reviewController'
);

router.get(
  '/:productId',
  getReviews
);

router.post(
  '/:productId',
  protect,
  addReview
);

module.exports =
  router;
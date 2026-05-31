const express = require('express');

const router = express.Router();

const { protect } = require('../middleware/auth');

const roleCheck = require('../middleware/roleCheck');

const artisanApprovalMiddleware = require(
  '../middleware/artisanApprovalMiddleware'
);

// CONTROLLERS

const {
  createOrder,
  getCustomerOrders,
  getArtisanOrders,
  updateOrderStatus,
} = require('../controllers/orderController');

// CUSTOMER ROUTES

router.post(
  '/',
  protect,
  roleCheck('customer'),
  createOrder
);

router.get(
  '/customer',
  protect,
  roleCheck('customer'),
  getCustomerOrders
);

// APPROVED ARTISAN ROUTES

router.get(
  '/artisan',
  protect,
  roleCheck('artisan'),
  artisanApprovalMiddleware,
  getArtisanOrders
);

router.put(
  '/:id/status',
  protect,
  roleCheck('artisan'),
  artisanApprovalMiddleware,
  updateOrderStatus
);

// CUSTOMER: mark order as received
const { markOrderReceived } = require("../controllers/orderController");
router.put("/:id/received", protect, roleCheck("customer"), markOrderReceived);

module.exports = router;
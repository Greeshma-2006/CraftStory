const express = require('express');

const router = express.Router();

const {
  protect,
} = require('../middleware/auth');

const roleCheck =
  require('../middleware/roleCheck');

const artisanApprovalMiddleware =
  require(
    '../middleware/artisanApprovalMiddleware'
  );

const {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  getArtisanProducts,
  getProductsByArtisan,
} = require(
  '../controllers/productController'
);

// ======================
// PUBLIC ROUTES
// ======================

router.get(
  '/',
  getAllProducts
);

// IMPORTANT:
// Place BEFORE '/:id'

router.get(
  '/my/products',
  protect,
  roleCheck('artisan'),
  artisanApprovalMiddleware,
  getArtisanProducts
);

router.get(
  '/artisan/:artisanId',
  getProductsByArtisan
);

router.get(
  '/:id',
  getSingleProduct
);

// ======================
// APPROVED ARTISANS ONLY
// ======================

router.post(
  '/',
  protect,
  roleCheck('artisan'),
  artisanApprovalMiddleware,
  createProduct
);

router.put(
  '/:id',
  protect,
  roleCheck('artisan'),
  artisanApprovalMiddleware,
  updateProduct
);

router.delete(
  '/:id',
  protect,
  roleCheck('artisan'),
  artisanApprovalMiddleware,
  deleteProduct
);

module.exports = router;
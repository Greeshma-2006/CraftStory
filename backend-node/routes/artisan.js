const express = require('express');

const router = express.Router();

const {
  createArtisanProfile,
  getMyArtisanProfile,
  updateArtisanProfile,
  resubmitProfile,
  getApprovedArtisans,
  getApprovedArtisanById,
} = require(
  '../controllers/artisanController'
);

const {
  protect,
} = require(
  '../middleware/auth'
);

const roleCheck =
  require(
    '../middleware/roleCheck'
  );

// PUBLIC

router.get(
  '/approved',
  getApprovedArtisans
);

router.get(
  '/approved/:id',
  getApprovedArtisanById
);

// ARTISAN ONLY

router.post(
  '/profile',
  protect,
  roleCheck('artisan'),
  createArtisanProfile
);

router.get(
  '/profile/me',
  protect,
  roleCheck('artisan'),
  getMyArtisanProfile
);

router.put(
  '/profile',
  protect,
  roleCheck('artisan'),
  updateArtisanProfile
);

router.put(
  '/resubmit',
  protect,
  roleCheck('artisan'),
  resubmitProfile
);

module.exports = router;
const express = require('express');

const router = express.Router();

const {
  getDashboardStats,

  getPendingRequests,

  approveArtisan,

  rejectArtisan,

  revokeArtisan,

  getApprovedArtisans,

  getRejectedArtisans,

  getRevokedArtisans,
} = require(
  '../controllers/adminController'
);

const {
  protect,
} = require('../middleware/auth');

const roleCheck =
  require('../middleware/roleCheck');

// ADMIN ONLY

router.use(protect);

router.use(
  roleCheck('admin')
);

// DASHBOARD

router.get(
  '/dashboard',
  getDashboardStats
);

// PENDING

router.get(
  '/artisans/pending',
  getPendingRequests
);

// APPROVED

router.get(
  '/artisans/approved',
  getApprovedArtisans
);

// REJECTED

router.get(
  '/artisans/rejected',
  getRejectedArtisans
);

// REVOKED

router.get(
  '/artisans/revoked',
  getRevokedArtisans
);

// APPROVE

router.put(
  '/artisans/:id/approve',
  approveArtisan
);

// REJECT

router.put(
  '/artisans/:id/reject',
  rejectArtisan
);

// REVOKE

router.put(
  '/artisans/:id/revoke',
  revokeArtisan
);

module.exports = router;
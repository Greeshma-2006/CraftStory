const express = require('express');

const router = express.Router();

const {
  protect,
} = require('../middleware/auth');

const roleCheck =
  require('../middleware/roleCheck');

const {
  createReport,
  getMyReports,
  getAllReports,
  updateReportStatus,
} = require('../controllers/reportController');

// CUSTOMER

router.post(
  '/',
  protect,
  roleCheck('customer'),
  createReport
);

router.get(
  '/my',
  protect,
  roleCheck('customer'),
  getMyReports
);

// ADMIN

router.get(
  '/',
  protect,
  roleCheck('admin'),
  getAllReports
);

router.put(
  '/:id',
  protect,
  roleCheck('admin'),
  updateReportStatus
);

module.exports = router;
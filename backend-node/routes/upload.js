const express = require('express');

const router = express.Router();

const {
  getSignature,
  deleteImage,
  uploadImage,
} = require('../controllers/uploadController');

const {
  protect,
} = require('../middleware/auth');

const upload =
  require('../middleware/upload');

router.use(protect);

// DIRECT IMAGE UPLOAD

router.post(
  '/',
  upload.single('file'),
  uploadImage
);

// CLOUDINARY SIGNATURE

router.get(
  '/signature',
  getSignature
);

// DELETE IMAGE

router.post(
  '/delete',
  deleteImage
);

module.exports = router;
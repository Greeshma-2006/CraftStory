const express = require('express');
const router = express.Router();
const {
  upsertCraftStory,
  getAllStories,
  getStory,
  getMyStory,
  togglePublish,
  getStoryByArtisan
} = require('../controllers/craftStoryController');
const { protect } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// PUBLIC ROUTES
// IMPORTANT: specific routes BEFORE /:id wildcard

router.get('/', getAllStories);

router.get('/artisan/:artisanId', getStoryByArtisan);

// PROTECTED ROUTES (specific before wildcard)

router.get('/my/story', protect, roleCheck('artisan'), getMyStory);

router.put('/my/publish', protect, roleCheck('artisan'), togglePublish);

router.post('/', protect, roleCheck('artisan'), upsertCraftStory);

// WILDCARD LAST

router.get('/:id', getStory);

module.exports = router;

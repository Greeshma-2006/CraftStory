const CraftStory = require('../models/CraftStory');

// Create or update craft story (Artisan only)
exports.upsertCraftStory = async (req, res) => {
  try {
    const { title, content, heritage, inspiration, craftingProcess } = req.body;

    let story = await CraftStory.findOne({ artisan: req.user._id });

    if (story) {
      // Update existing story
      story = await CraftStory.findByIdAndUpdate(
        story._id,
        { title, content, heritage, inspiration, craftingProcess },
        { new: true, runValidators: true }
      ).populate('artisan', 'name email profileImage artisanProfile');

      return res.status(200).json({
        success: true,
        message: 'CraftStory updated successfully',
        data: story,
      });
    }

    // Create new story
    story = await CraftStory.create({
      artisan: req.user._id,
      title,
      content,
      heritage,
      inspiration,
      craftingProcess,
    });

    await story.populate('artisan', 'name email profileImage artisanProfile');

    res.status(201).json({
      success: true,
      message: 'CraftStory created successfully',
      data: story,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all craft stories
exports.getAllStories = async (req, res) => {
  try {
    const stories = await CraftStory.find({ isPublished: true })
      .populate('artisan', 'name email profileImage artisanProfile')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: stories.length,
      data: stories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single craft story
exports.getStory = async (req, res) => {
  try {
    const story = await CraftStory.findById(req.params.id)
      .populate('artisan', 'name email profileImage artisanProfile');

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'CraftStory not found'
      });
    }

    // Increment views
    story.views += 1;
    await story.save();

    res.status(200).json({
      success: true,
      data: story,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get artisan's own story
exports.getMyStory = async (req, res) => {
  try {
    const story = await CraftStory.findOne({ artisan: req.user._id })
      .populate('artisan', 'name email profileImage artisanProfile');

    res.status(200).json({
      success: true,
      data: story,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Toggle publish status
exports.togglePublish = async (req, res) => {
  try {
    const story = await CraftStory.findOne({ artisan: req.user._id });

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'CraftStory not found'
      });
    }

    story.isPublished = !story.isPublished;
    await story.save();

    res.status(200).json({
      success: true,
      message: `CraftStory ${story.isPublished ? 'published' : 'unpublished'} successfully`,
      data: story,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get story by artisan ID
exports.getStoryByArtisan = async (req, res) => {
  try {
    const story = await CraftStory.findOne({ 
      artisan: req.params.artisanId,
      isPublished: true 
    }).populate('artisan', 'name email profileImage artisanProfile');

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'CraftStory not found for this artisan'
      });
    }

    res.status(200).json({
      success: true,
      data: story,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
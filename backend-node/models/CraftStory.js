const mongoose = require('mongoose');

const craftStorySchema = new mongoose.Schema({
  artisan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: [true, 'Story title is required'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Story content is required'],
  },
  images: [{
    url: String,
    publicId: String,
    caption: String,
  }],
  heritage: {
    type: String,
    trim: true,
  },
  inspiration: {
    type: String,
    trim: true,
  },
  craftingProcess: {
    type: String,
    trim: true,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  views: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.models.CraftStory || mongoose.model('CraftStory', craftStorySchema);
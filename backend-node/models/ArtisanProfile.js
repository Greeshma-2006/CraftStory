const mongoose = require('mongoose');

const artisanProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    firstName: { type: String, required: true, trim: true },
    lastName:  { type: String, required: true, trim: true },
    email:     { type: String, required: true, trim: true, lowercase: true },
    phone:     { type: String, required: true, trim: true },
    story:     { type: String, required: true, trim: true },

    // Array of image URLs — min 2, max 5
    artisanImages: {
      type: [String],
      validate: {
        validator: (arr) => arr.length >= 2 && arr.length <= 5,
        message: 'Artisan images must be between 2 and 5',
      },
      default: undefined,
    },

    craftImages: {
      type: [String],
      validate: {
        validator: (arr) => arr.length >= 2 && arr.length <= 5,
        message: 'Craft images must be between 2 and 5',
      },
      default: undefined,
    },

    // ── FEATURED IMAGES (chosen by artisan for article card display) ──────────
    featuredArtisanImage: { type: String, default: '' }, // small circle avatar on card
    featuredCraftImage:   { type: String, default: '' }, // background image on card

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'revoked'],
      default: 'pending',
    },

    rejectionReason: { type: String, default: '' },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    approvedAt: { type: Date, default: null },
    rejectedAt: { type: Date, default: null },
    revokedAt:  { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.models.ArtisanProfile || mongoose.model('ArtisanProfile', artisanProfileSchema);

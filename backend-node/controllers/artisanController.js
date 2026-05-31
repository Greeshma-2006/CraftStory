const ArtisanProfile = require('../models/ArtisanProfile');
const User = require('../models/User');

// =========================
// CREATE ARTISAN PROFILE
// =========================

exports.createArtisanProfile = async (req, res) => {

  try {

    const {
      firstName,
      lastName,
      email,
      phone,
      story,
      artisanImages,
      craftImages,
    } = req.body;

    // Validate image arrays
    if (!Array.isArray(artisanImages) || artisanImages.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least 2 artisan/workplace images',
      });
    }

    if (!Array.isArray(craftImages) || craftImages.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least 2 craft/product images',
      });
    }

    if (artisanImages.length > 5) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 5 artisan/workplace images allowed',
      });
    }

    if (craftImages.length > 5) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 5 craft/product images allowed',
      });
    }

    const existingProfile = await ArtisanProfile.findOne({
      user: req.user._id,
    });

    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: 'Artisan profile already exists',
      });
    }

    const profile = await ArtisanProfile.create({
      user: req.user._id,
      firstName,
      lastName,
      email,
      phone,
      story,
      artisanImages,
      craftImages,
      status: 'pending',
    });

    await User.findByIdAndUpdate(req.user._id, {
      artisanStatus: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Artisan profile submitted successfully',
      data: profile,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// GET MY PROFILE
// =========================

exports.getMyArtisanProfile = async (req, res) => {

  try {

    const profile = await ArtisanProfile.findOne({
      user: req.user._id,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Artisan profile not found',
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// UPDATE PROFILE
// =========================

exports.updateArtisanProfile = async (req, res) => {

  try {

    const {
      artisanImages,
      craftImages,
    } = req.body;

    // Validate image arrays if provided
    if (artisanImages !== undefined) {

      if (!Array.isArray(artisanImages) || artisanImages.length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Please upload at least 2 artisan/workplace images',
        });
      }

      if (artisanImages.length > 5) {
        return res.status(400).json({
          success: false,
          message: 'Maximum 5 artisan/workplace images allowed',
        });
      }
    }

    if (craftImages !== undefined) {

      if (!Array.isArray(craftImages) || craftImages.length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Please upload at least 2 craft/product images',
        });
      }

      if (craftImages.length > 5) {
        return res.status(400).json({
          success: false,
          message: 'Maximum 5 craft/product images allowed',
        });
      }
    }

    const profile = await ArtisanProfile.findOne({
      user: req.user._id,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Artisan profile not found',
      });
    }

    Object.assign(profile, req.body);

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: profile,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// RESUBMIT PROFILE
// =========================

exports.resubmitProfile = async (req, res) => {

  try {

    const profile = await ArtisanProfile.findOne({
      user: req.user._id,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Artisan profile not found',
      });
    }

    profile.status = 'pending';
    profile.rejectionReason = '';

    await profile.save();

    await User.findByIdAndUpdate(req.user._id, {
      artisanStatus: 'pending',
      rejectionReason: '',
    });

    res.status(200).json({
      success: true,
      message: 'Profile resubmitted for approval',
      data: profile,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// PUBLIC APPROVED ARTISANS
// =========================

exports.getApprovedArtisans = async (req, res) => {

  try {

    const artisans = await ArtisanProfile.find({ status: 'approved' })
      .populate('user', 'name email role artisanStatus')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: artisans.length,
      data: artisans,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// SINGLE APPROVED ARTISAN
// =========================

exports.getApprovedArtisanById = async (req, res) => {

  try {

    const artisan = await ArtisanProfile.findOne({
      _id: req.params.id,
      status: 'approved',
    }).populate('user', 'name email role artisanStatus');

    if (!artisan) {
      return res.status(404).json({
        success: false,
        message: 'Artisan not found',
      });
    }

    res.status(200).json({
      success: true,
      data: artisan,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

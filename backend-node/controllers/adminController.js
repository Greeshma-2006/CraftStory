const User = require('../models/User');
const ArtisanProfile = require('../models/ArtisanProfile');
const Product = require('../models/Product');
const Order = require('../models/Order');

// DASHBOARD STATS

exports.getDashboardStats =
async (req, res) => {

  try {

    const totalArtisans =
      await User.countDocuments({
        role: 'artisan',
      });

    const approvedArtisans =
      await ArtisanProfile.countDocuments({
        status: 'approved',
      });

    const rejectedArtisans =
      await ArtisanProfile.countDocuments({
        status: 'rejected',
      });

    const pendingRequests =
      await ArtisanProfile.countDocuments({
        status: 'pending',
      });

    const totalProducts =
      await Product.countDocuments();

    const totalOrders =
      await Order.countDocuments();

    res.status(200).json({

      success: true,

      data: {

        totalArtisans,

        approvedArtisans,

        rejectedArtisans,

        pendingRequests,

        totalProducts,

        totalOrders,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PENDING REQUESTS

exports.getPendingRequests =
async (req, res) => {

  try {

    const requests =
      await ArtisanProfile.find({
        status: 'pending',
      })
      .populate(
        'user',
        'name email'
      );

    res.status(200).json({

      success: true,

      count: requests.length,

      data: requests,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// APPROVE

exports.approveArtisan =
async (req, res) => {

  try {

    const artisan =
      await ArtisanProfile.findById(
        req.params.id
      );

    if (!artisan) {

      return res.status(404).json({
        success: false,
        message:
          'Artisan not found',
      });
    }

    artisan.status =
      'approved';

    artisan.approvedBy =
      req.user._id;

    artisan.approvedAt =
      new Date();

    artisan.rejectionReason =
      '';

    await artisan.save();

    await User.findByIdAndUpdate(
      artisan.user,
      {
        artisanStatus:
          'approved',

        rejectionReason:
          '',
      }
    );

    res.status(200).json({

      success: true,

      message:
        'Artisan approved successfully',
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// REJECT

exports.rejectArtisan =
async (req, res) => {

  try {

    const {
      reason,
    } = req.body;

    if (!reason) {

      return res.status(400).json({
        success: false,
        message:
          'Rejection reason required',
      });
    }

    const artisan =
      await ArtisanProfile.findById(
        req.params.id
      );

    if (!artisan) {

      return res.status(404).json({
        success: false,
        message:
          'Artisan not found',
      });
    }

    artisan.status =
      'rejected';

    artisan.rejectionReason =
      reason;

    artisan.rejectedAt =
      new Date();

    await artisan.save();

    await User.findByIdAndUpdate(
      artisan.user,
      {
        artisanStatus:
          'rejected',

        rejectionReason:
          reason,
      }
    );

    res.status(200).json({

      success: true,

      message:
        'Artisan rejected',
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// REVOKE

exports.revokeArtisan =
async (req, res) => {

  try {

    const {
      reason,
    } = req.body;

    const artisan =
      await ArtisanProfile.findById(
        req.params.id
      );

    if (!artisan) {

      return res.status(404).json({
        success: false,
        message:
          'Artisan not found',
      });
    }

    artisan.status =
      'revoked';

    artisan.rejectionReason =
      reason;

    artisan.revokedAt =
      new Date();

    await artisan.save();

    await User.findByIdAndUpdate(
      artisan.user,
      {
        artisanStatus:
          'revoked',

        rejectionReason:
          reason,
      }
    );

    res.status(200).json({

      success: true,

      message:
        'Artisan revoked',
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// APPROVED LIST

exports.getApprovedArtisans =
async (req, res) => {

  try {
    const artisans =
  await ArtisanProfile.find({
    status: 'approved',
  }).populate(
    'user',
    'name email'
  );


         

    res.status(200).json({
      success: true,
      data: artisans,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// REJECTED LIST

exports.getRejectedArtisans =
async (req, res) => {

  try {

    const artisans =
  await ArtisanProfile.find({
    status: 'rejected',
  }).populate(
    'user',
    'name email'
  );

    res.status(200).json({
      success: true,
      data: artisans,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// REVOKED LIST

exports.getRevokedArtisans =
async (req, res) => {

  try {

    const artisans =
  await ArtisanProfile.find({
    status: 'revoked',
  }).populate(
    'user',
    'name email'
  );

    res.status(200).json({
      success: true,
      data: artisans,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const User = require('../models/User');

const artisanApprovalMiddleware = async (req, res, next) => {

  try {

    const user = await User.findById(req.user._id);

    if (
      user.role === 'artisan' &&
      user.artisanStatus !== 'approved'
    ) {

      return res.status(403).json({
        success: false,
        message: 'Artisan approval required',
      });
    }

    next();

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = artisanApprovalMiddleware;
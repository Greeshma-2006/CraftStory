const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {

  try {

    let token;

    // GET TOKEN

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {

      token = req.headers.authorization.split(' ')[1];
    }

    // TOKEN MISSING

    if (!token) {

      return res.status(401).json({
        success: false,
        message: 'Not authorized, token missing',
      });
    }

    // VERIFY TOKEN

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // FIND USER

    req.user = await User.findById(decoded.id).select('-password');

    // USER NOT FOUND

    if (!req.user) {

      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    // ADMIN EXTRA SECURITY

    if (
      req.user.role === 'admin' &&
      !req.user.isEmailVerified
    ) {

      return res.status(401).json({
        success: false,
        message: 'Admin email verification required',
      });
    }

    next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: 'Not authorized, token invalid',
    });
  }
};

module.exports = { protect };
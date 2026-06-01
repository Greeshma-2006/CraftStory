const crypto = require('crypto');

const User = require('../models/User');
const ArtisanProfile = require('../models/ArtisanProfile');
const Cart = require('../models/Cart');
const WishList = require('../models/WishList');

const { generateToken } = require('../utils/jwt');
const sendEmail = require('../utils/sendEmail');

// ─── REGISTER ────────────────────────────────────────────────────────────────

exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, role, phone } = req.body;

    const name = `${firstName} ${lastName}`.trim();

    if (!firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'First name and last name are required',
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // BLOCK admin registration from register page
    if (role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin registration is not allowed',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role === 'artisan' ? 'artisan' : 'customer',
      artisanStatus: role === 'artisan' ? 'pending' : undefined,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message:
        role === 'artisan'
          ? 'Artisan registered successfully. Complete your artisan profile.'
          : 'Registration successful',
      data: { user, token },
    });
  } catch (error) {
    console.log('REGISTER ERROR =>', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const match = await user.comparePassword(password);

    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // ── ADMIN: send email verification token ──────────────────────────────────
    if (user.role === 'admin') {
      const token = crypto.randomBytes(32).toString('hex');

      user.adminVerificationToken = token;
      user.adminVerificationExpire = Date.now() + 15 * 60 * 1000; // 15 min
      user.isEmailVerified = false; // reset on every login attempt

      await user.save();

      const verifyUrl = `${process.env.CLIENT_URL}/admin/verify-login/${token}`;

      // Await the email — with Brevo HTTP API this is fast (< 2s)
      // If it fails, return a real error so admin knows email wasn't sent
      try {
        await sendEmail({
          email: user.email,
          subject: 'CraftStory Admin Login Verification',
          html: `
            <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; background: #FFF9F3; border-radius: 16px; padding: 40px; border: 1px solid #E7D5C7;">
              <h1 style="color: #C96A4A; font-size: 28px; margin-bottom: 8px;">CraftStory</h1>
              <h2 style="color: #6B3E2E; font-size: 22px; margin-bottom: 24px;">Admin Login Verification</h2>
              <p style="color: #6B3E2E; line-height: 1.6;">
                A login attempt was made for the admin account. Click the button below to verify and complete your login.
                This link expires in <strong>15 minutes</strong>.
              </p>
              <div style="text-align: center; margin: 36px 0;">
                <a href="${verifyUrl}"
                   style="background: #C96A4A; color: white; padding: 14px 36px; border-radius: 50px; text-decoration: none; font-size: 16px; font-weight: bold; display: inline-block;">
                  Verify Admin Login
                </a>
              </div>
              <p style="color: #6B3E2E80; font-size: 13px;">
                If you did not attempt this login, please ignore this email.
                Your account remains secure.
              </p>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error('Admin verification email failed:', emailErr.message);
        return res.status(500).json({
          success: false,
          message: `Login failed: could not send verification email. ${emailErr.message}`,
        });
      }

      return res.status(200).json({
        success: true,
        requiresVerification: true,
        message: 'Verification email sent to admin account',
      });
    }

    // ── ARTISAN: check approval status ───────────────────────────────────────
    if (user.role === 'artisan') {
      const profile = await ArtisanProfile.findOne({ user: user._id });

      if (profile) {
        if (profile.status === 'rejected') {
          return res.status(403).json({
            success: false,
            message: profile.rejectionReason || 'Profile rejected',
          });
        }
        if (profile.status === 'revoked') {
          return res.status(403).json({
            success: false,
            message: profile.rejectionReason || 'Approval revoked',
          });
        }
      }
    }

    const token = generateToken(user._id);
    user.password = undefined;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { user, token },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── VERIFY ADMIN LOGIN ───────────────────────────────────────────────────────

exports.verifyAdminLogin = async (req, res, next) => {
  try {
    const user = await User.findOne({
      adminVerificationToken: req.params.token,
      adminVerificationExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification link',
      });
    }

    user.isEmailVerified = true;
    user.adminVerificationToken = null;
    user.adminVerificationExpire = null;

    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({ success: true, token, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── FORGOT PASSWORD ──────────────────────────────────────────────────────────

exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Await the email — with Brevo HTTP API this is fast (< 2s)
    // If it fails, tell the user instead of silently swallowing the error
    await sendEmail({
      email: user.email,
      subject: 'CraftStory Password Reset',
      html: `
        <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; background: #FFF9F3; border-radius: 16px; padding: 40px; border: 1px solid #E7D5C7;">
          <h1 style="color: #C96A4A; font-size: 28px; margin-bottom: 8px;">CraftStory</h1>
          <h2 style="color: #6B3E2E; font-size: 22px; margin-bottom: 24px;">Password Reset</h2>
          <p style="color: #6B3E2E; line-height: 1.6;">
            We received a request to reset your password. Click the button below — this link expires in <strong>15 minutes</strong>.
          </p>
          <div style="text-align: center; margin: 36px 0;">
            <a href="${resetUrl}"
               style="background: #C96A4A; color: white; padding: 14px 36px; border-radius: 50px; text-decoration: none; font-size: 16px; font-weight: bold; display: inline-block;">
              Reset My Password
            </a>
          </div>
          <p style="color: #6B3E2E80; font-size: 13px;">
            If you did not request a password reset, please ignore this email.
          </p>
        </div>
      `,
    });

    res.status(200).json({ success: true, message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── RESET PASSWORD ───────────────────────────────────────────────────────────

exports.resetPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpire: { $gt: Date.now() },
    }).select('+password');

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    user.password = req.body.password;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET ME ───────────────────────────────────────────────────────────────────

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── UPDATE PROFILE ───────────────────────────────────────────────────────────

exports.updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, profileImage } = req.body;

    // Build update object
    const updateData = {};

    if (firstName || lastName) {
      const currentUser = await User.findById(req.user._id);
      const parts = currentUser.name.split(' ');
      const currentFirst = parts[0] || '';
      const currentLast = parts.slice(1).join(' ') || '';
      const newFirst = firstName || currentFirst;
      const newLast = lastName || currentLast;
      updateData.name = `${newFirst} ${newLast}`.trim();
    }

    if (email && email !== req.user.email) {
      // Check email uniqueness
      const existing = await User.findOne({ email, _id: { $ne: req.user._id } });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Email is already in use by another account',
        });
      }
      updateData.email = email;
    }

    if (phone !== undefined) updateData.phone = phone;
    if (profileImage !== undefined) updateData.profileImage = profileImage;

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Profile Updated Successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── DELETE ACCOUNT ───────────────────────────────────────────────────────────

exports.deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Delete cart
    await Cart.deleteMany({ user: userId });

    // Delete wishlist
    await WishList.deleteMany({ user: userId });

    // Delete artisan profile if exists
    await ArtisanProfile.deleteMany({ user: userId });

    // Delete user
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: 'Account Deleted Successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    phone: {
      type: String,
      default: '',
    },

    role: {
      type: String,
      enum: ['customer', 'artisan', 'admin'],
      default: 'customer',
    },

    // Only populated for artisan accounts
    artisanStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'revoked'],
      default: undefined,
    },

    rejectionReason: {
      type: String,
      default: '',
    },

    profileImage: {
      type: String,
      default: '',
    },

    address: {
      type: String,
      default: '',
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    adminVerificationToken: {
      type: String,
      default: null,
    },

    adminVerificationExpire: {
      type: Date,
      default: null,
    },

    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordExpire: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// HASH PASSWORD
// NOTE: Mongoose 7+ async pre-hooks do NOT receive `next` — just return/await

userSchema.pre('save', async function () {

  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);
});

// COMPARE PASSWORD

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
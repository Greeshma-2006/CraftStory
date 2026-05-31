const mongoose = require('mongoose');

const reportSchema =
  new mongoose.Schema(
    {
      customer: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },

      subject: {
        type: String,
        required: true,
        trim: true,
      },

      description: {
        type: String,
        required: true,
      },

      status: {
        type: String,
        enum: [
          'Pending',
          'In Review',
          'Resolved',
        ],
        default: 'Pending',
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.models.Report || mongoose.model('Report', reportSchema);
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    artisan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    materials: [
      {
        type: String,
      },
    ],

    dimensions: {
      type: String,
      default: '',
    },

    weight: {
      type: String,
      default: '',
    },

    customizable: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({
  name: 'text',
  description: 'text',
  category: 'text',
});

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
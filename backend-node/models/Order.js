const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type:   String,
      unique: true,
      sparse: true,
    },

    customer: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },

    artisan: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },

    products: [
      {
        product: {
          type:     mongoose.Schema.Types.ObjectId,
          ref:      'Product',
          required: true,
        },
        quantity: {
          type:     Number,
          required: true,
          min:      1,
        },
      },
    ],

    totalAmount: {
      type:     Number,
      required: true,
    },

    paymentMethod: {
      type:     String,
      enum:     ['razorpay', 'cod'],
      required: true,
    },

    paymentStatus: {
      type:    String,
      enum:    ['Pending', 'Paid', 'Failed'],
      default: 'Pending',
    },

    paymentId: {
      type:    String,
      default: null,
    },

    shippingAddress: {
      type:     String,
      required: true,
      trim:     true,
    },

    phoneNumber: {
      type:     String,
      required: true,
      trim:     true,
    },

    orderStatus: {
      type:    String,
      enum:    [
        'Order Received',
        'Preparing',
        'Shipped',
        'Out For Delivery',
        'Delivered',
      ],
      default: 'Order Received',
    },

    deliveryDate: {
      type:    Date,
      default: null,
    },

    orderNotes: {
      type:    String,
      default: '',
      trim:    true,
    },
  },
  {
    timestamps: true,
  }
);

// Mongoose 9.x: async pre-hooks do NOT receive next — just return
orderSchema.pre('save', async function () {
  if (!this.orderNumber) {
    const ts   = Date.now().toString().slice(-6);
    const rand = Math.floor(1000 + Math.random() * 9000);
    this.orderNumber = 'CS-' + ts + rand;
  }
});

module.exports =
  mongoose.models.Order ||
  mongoose.model('Order', orderSchema);

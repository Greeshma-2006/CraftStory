const Order   = require('../models/Order');
const Product = require('../models/Product');

// ─── CREATE ORDER ─────────────────────────────────────────────────────────────

exports.createOrder = async (req, res) => {
  try {
    const {
      products,
      paymentMethod,
      shippingAddress,
      phoneNumber,
      orderNotes,
      paymentId,   // optional – provided for Razorpay
    } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ success: false, message: 'No products selected' });
    }

    if (!shippingAddress || !shippingAddress.trim()) {
      return res.status(400).json({ success: false, message: 'Shipping address is required' });
    }

    if (!phoneNumber || !phoneNumber.trim()) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    let totalAmount  = 0;
    const orderItems = [];
    let artisanId    = null;

    for (const item of products) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `"${product.name}" has insufficient stock (available: ${product.stock})`,
        });
      }

      // Deduct stock
      product.stock -= item.quantity;
      await product.save();

      totalAmount += product.price * item.quantity;
      artisanId    = product.artisan;

      orderItems.push({ product: product._id, quantity: item.quantity });
    }

    const order = await Order.create({
      customer:       req.user._id,
      artisan:        artisanId,
      products:       orderItems,
      totalAmount,
      paymentMethod,
      paymentStatus:  paymentMethod === 'cod' ? 'Pending' : 'Paid',
      paymentId:      paymentId || null,
      shippingAddress,
      phoneNumber,
      orderNotes:     orderNotes || '',
      orderStatus:    'Order Received',
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data:    order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── CUSTOMER: GET ORDERS ─────────────────────────────────────────────────────

exports.getCustomerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate('artisan',           'name email')
      .populate('products.product')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── ARTISAN: GET ORDERS ──────────────────────────────────────────────────────

exports.getArtisanOrders = async (req, res) => {
  try {
    const orders = await Order.find({ artisan: req.user._id })
      .populate('customer',          'name email phone')
      .populate('products.product')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── ARTISAN: UPDATE ORDER STATUS ────────────────────────────────────────────
// Artisan can set: Preparing → Shipped → Out For Delivery
// NOT allowed to set Delivered (only customer confirms receipt)

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const artisanAllowed = ['Preparing', 'Shipped', 'Out For Delivery'];

    if (!artisanAllowed.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Artisan can only set status to: ${artisanAllowed.join(', ')}`,
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.artisan.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    order.orderStatus = orderStatus;
    await order.save();

    res.status(200).json({ success: true, message: 'Order status updated', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── CUSTOMER: CONFIRM RECEIPT (marks Delivered) ─────────────────────────────

exports.markOrderReceived = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (order.orderStatus !== 'Out For Delivery') {
      return res.status(400).json({
        success: false,
        message: 'You can only confirm receipt when order is "Out For Delivery"',
      });
    }

    order.orderStatus  = 'Delivered';
    order.deliveryDate = new Date();
    await order.save();

    res.status(200).json({ success: true, message: 'Order marked as delivered', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

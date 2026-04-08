const Order = require('../models/Order');
const Mockup = require('../models/Mockup');
const User = require('../models/User');

// @desc Create order
const createOrder = async (req, res) => {
  try {
    const { mockupId, quantity, notes } = req.body;

    const mockup = await Mockup.findById(mockupId);
    if (!mockup) {
      return res.status(404).json({ message: 'Mockup not found' });
    }

    const totalPrice = mockup.price * quantity;

    const order = await Order.create({
      client: req.user._id,
      mockup: mockupId,
      quantity,
      totalPrice,
      notes,
      statusHistory: [{ status: 'pending', changedBy: req.user._id }]
    });

    // Notify designer
    await User.findByIdAndUpdate(mockup.designer, {
      $push: {
        notifications: {
          message: `New order received for "${mockup.title}" from ${req.user.name}!`,
        }
      }
    });

    const populated = await Order.findById(order._id)
      .populate('mockup', 'title imageUrl price')
      .populate('client', 'name email');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get orders
const getOrders = async (req, res) => {
  try {
    let orders;

    if (req.user.role === 'client') {
      orders = await Order.find({ client: req.user._id })
        .populate('mockup', 'title imageUrl price designer')
        .populate('client', 'name email')
        .sort({ createdAt: -1 });
    } else {
      const myMockups = await Mockup.find({ designer: req.user._id });
      const mockupIds = myMockups.map(m => m._id);
      orders = await Order.find({ mockup: { $in: mockupIds } })
        .populate('mockup', 'title imageUrl price')
        .populate('client', 'name email')
        .sort({ createdAt: -1 });
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single order
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('mockup', 'title imageUrl price')
      .populate('client', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id)
      .populate('mockup')
      .populate('client', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    order.statusHistory.push({
      status,
      changedBy: req.user._id
    });

    await order.save();

    // Notify client
    await User.findByIdAndUpdate(order.client._id, {
      $push: {
        notifications: {
          message: `Your order for "${order.mockup.title}" is now ${status}!`,
        }
      }
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    if (req.user.role === 'designer') {
      const myMockups = await Mockup.find({ designer: req.user._id });
      const mockupIds = myMockups.map(m => m._id);
      const allOrders = await Order.find({ mockup: { $in: mockupIds } });

      res.json({
        totalMockups: myMockups.length,
        ordersReceived: allOrders.length,
        pendingOrders: allOrders.filter(o => o.status === 'pending').length,
        completedOrders: allOrders.filter(o => o.status === 'completed').length,
        revenue: allOrders
          .filter(o => o.status === 'completed')
          .reduce((sum, o) => sum + o.totalPrice, 0)
      });
    } else {
      const myOrders = await Order.find({ client: req.user._id });
      res.json({
        totalOrders: myOrders.length,
        pendingOrders: myOrders.filter(o => o.status === 'pending').length,
        completedOrders: myOrders.filter(o => o.status === 'completed').length,
        totalSpent: myOrders
          .filter(o => o.status === 'completed')
          .reduce((sum, o) => sum + o.totalPrice, 0)
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getDashboardStats
};
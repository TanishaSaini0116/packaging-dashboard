const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getDashboardStats
} = require('../controllers/orderController');
const { protect, designerOnly } = require('../middleware/auth');

router.get('/stats', protect, getDashboardStats);
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrderById);
router.post('/', protect, createOrder);
router.patch('/:id/status', protect, designerOnly, updateOrderStatus);

module.exports = router;
const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getProfile,
  getNotifications,
  markNotificationRead
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.get('/notifications', protect, getNotifications);
router.patch('/notifications/:id', protect, markNotificationRead);

module.exports = router;
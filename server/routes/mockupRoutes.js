const express = require('express');
const router = express.Router();
const {
  getMockups,
  getMockupById,
  createMockup,
  updateMockup,
  deleteMockup
} = require('../controllers/mockupController');
const { protect, designerOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', protect, getMockups);
router.get('/:id', protect, getMockupById);
router.post('/', protect, designerOnly, upload.single('image'), createMockup);
router.put('/:id', protect, designerOnly, upload.single('image'), updateMockup);
router.delete('/:id', protect, designerOnly, deleteMockup);

module.exports = router;
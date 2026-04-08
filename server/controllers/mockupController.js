const Mockup = require('../models/Mockup');
const cloudinary = require('../config/cloudinary');

// @desc Get all mockups
const getMockups = async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    let query = {};

    if (category && category !== 'All assets') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };

    const mockups = await Mockup.find(query)
      .populate('designer', 'name email avatar')
      .sort(sortOption);

    res.json(mockups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single mockup
const getMockupById = async (req, res) => {
  try {
    const mockup = await Mockup.findById(req.params.id)
      .populate('designer', 'name email avatar');

    if (!mockup) {
      return res.status(404).json({ message: 'Mockup not found' });
    }
    res.json(mockup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create mockup
const createMockup = async (req, res) => {
  try {
    const { title, description, price, category, tags } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const uploadResult = await cloudinary.uploader.upload(dataURI, {
      folder: 'packaging-dashboard',
      transformation: [{ width: 800, height: 600, crop: 'fill' }]
    });

    const mockup = await Mockup.create({
      title,
      description,
      price: Number(price),
      category,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      imageUrl: uploadResult.secure_url,
      cloudinaryId: uploadResult.public_id,
      designer: req.user._id
    });

    res.status(201).json(mockup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update mockup
const updateMockup = async (req, res) => {
  try {
    const mockup = await Mockup.findById(req.params.id);

    if (!mockup) {
      return res.status(404).json({ message: 'Mockup not found' });
    }

    if (mockup.designer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, description, price, category, tags } = req.body;

    if (req.file) {
      await cloudinary.uploader.destroy(mockup.cloudinaryId);
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const uploadResult = await cloudinary.uploader.upload(dataURI, {
        folder: 'packaging-dashboard'
      });
      mockup.imageUrl = uploadResult.secure_url;
      mockup.cloudinaryId = uploadResult.public_id;
    }

    mockup.title = title || mockup.title;
    mockup.description = description || mockup.description;
    mockup.price = price ? Number(price) : mockup.price;
    mockup.category = category || mockup.category;
    mockup.tags = tags ? tags.split(',').map(t => t.trim()) : mockup.tags;

    const updated = await mockup.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete mockup
const deleteMockup = async (req, res) => {
  try {
    const mockup = await Mockup.findById(req.params.id);

    if (!mockup) {
      return res.status(404).json({ message: 'Mockup not found' });
    }

    if (mockup.designer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await cloudinary.uploader.destroy(mockup.cloudinaryId);
    await mockup.deleteOne();

    res.json({ message: 'Mockup deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMockups,
  getMockupById,
  createMockup,
  updateMockup,
  deleteMockup
};
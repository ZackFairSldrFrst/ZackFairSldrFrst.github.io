const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Link = require('../models/Link');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Link validation middleware
const linkValidation = [
  body('title').trim().notEmpty(),
  body('url').trim().isURL(),
  body('icon').optional().trim(),
  body('order').optional().isInt({ min: 0 })
];

// Get all links for a user
router.get('/', auth, async (req, res) => {
  try {
    const links = await Link.find({ userId: req.user.userId })
      .sort({ order: 1 });
    res.json(links);
  } catch (error) {
    console.error('Links fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new link
router.post('/', auth, linkValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, url, icon, order } = req.body;

    // Check user's subscription for link limit
    const user = await User.findById(req.user.userId);
    const linkCount = await Link.countDocuments({ userId: req.user.userId });
    
    if (user.subscription === 'free' && linkCount >= 5) {
      return res.status(403).json({ 
        message: 'Free users can only have up to 5 links. Upgrade to premium for unlimited links.' 
      });
    }

    const link = new Link({
      userId: req.user.userId,
      title,
      url,
      icon: icon || 'link',
      order: order || linkCount
    });

    await link.save();
    res.status(201).json(link);
  } catch (error) {
    console.error('Link creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update link
router.put('/:id', auth, linkValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const link = await Link.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    const { title, url, icon, order, isActive } = req.body;

    link.title = title;
    link.url = url;
    link.icon = icon || link.icon;
    if (order !== undefined) link.order = order;
    if (isActive !== undefined) link.isActive = isActive;

    await link.save();
    res.json(link);
  } catch (error) {
    console.error('Link update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete link
router.delete('/:id', auth, async (req, res) => {
  try {
    const link = await Link.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    res.json({ message: 'Link deleted successfully' });
  } catch (error) {
    console.error('Link deletion error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reorder links
router.put('/reorder', auth, async (req, res) => {
  try {
    const { linkIds } = req.body;
    
    if (!Array.isArray(linkIds)) {
      return res.status(400).json({ message: 'Invalid link order' });
    }

    // Update order for each link
    await Promise.all(
      linkIds.map((id, index) => 
        Link.findOneAndUpdate(
          { _id: id, userId: req.user.userId },
          { order: index }
        )
      )
    );

    res.json({ message: 'Links reordered successfully' });
  } catch (error) {
    console.error('Link reorder error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get public links by user slug
router.get('/public/:slug', async (req, res) => {
  try {
    const user = await User.findOne({ slug: req.params.slug });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const links = await Link.find({ 
      userId: user._id,
      isActive: true 
    }).sort({ order: 1 });

    res.json(links);
  } catch (error) {
    console.error('Public links fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 
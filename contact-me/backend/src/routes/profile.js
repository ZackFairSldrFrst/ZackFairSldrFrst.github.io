const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get user profile
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile validation middleware
const updateValidation = [
  body('businessName').optional().trim().notEmpty(),
  body('bio').optional().trim().maxLength(500),
  body('profileImage').optional().trim()
];

// Update profile
router.put('/', auth, updateValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { businessName, bio, profileImage } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if provided
    if (businessName) user.businessName = businessName;
    if (bio) user.bio = bio;
    if (profileImage) user.profileImage = profileImage;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        businessName: user.businessName,
        slug: user.slug,
        bio: user.bio,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get public profile by slug
router.get('/:slug', async (req, res) => {
  try {
    const user = await User.findOne({ slug: req.params.slug })
      .select('businessName bio profileImage subscription');
    
    if (!user) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Public profile fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 
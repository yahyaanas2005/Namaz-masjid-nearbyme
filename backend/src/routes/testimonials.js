const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');
const { body, param, validationResult } = require('express-validator');

// Get testimonials for a mosque
router.get('/:mosqueId', [
  param('mosqueId').isMongoId(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const testimonials = await Testimonial.find({ mosqueId: req.params.mosqueId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

// Submit a testimonial
router.post('/', [
  body('mosqueId').isMongoId(),
  body('userId').notEmpty(),
  body('userName').notEmpty().trim(),
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').isLength({ min: 10, max: 500 }).trim(),
  body('prayerTimeAccuracy').isInt({ min: 1, max: 5 }),
  body('facilities').isInt({ min: 1, max: 5 }),
  body('cleanliness').isInt({ min: 1, max: 5 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const testimonial = new Testimonial(req.body);
    await testimonial.save();

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`mosque:${testimonial.mosqueId}`).emit('newTestimonial', testimonial);

    res.status(201).json(testimonial);
  } catch (error) {
    console.error('Error submitting testimonial:', error);
    res.status(500).json({ error: 'Failed to submit testimonial' });
  }
});

// Like a testimonial
router.post('/:id/like', [
  param('id').isMongoId(),
  body('userId').notEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const testimonial = await Testimonial.findById(req.params.id);
    
    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    const { userId } = req.body;

    // Check if user already liked
    if (testimonial.likedBy.includes(userId)) {
      // Unlike
      testimonial.likedBy = testimonial.likedBy.filter(id => id !== userId);
      testimonial.likes -= 1;
    } else {
      // Like
      testimonial.likedBy.push(userId);
      testimonial.likes += 1;
    }

    await testimonial.save();
    res.json(testimonial);
  } catch (error) {
    console.error('Error liking testimonial:', error);
    res.status(500).json({ error: 'Failed to like testimonial' });
  }
});

module.exports = router;

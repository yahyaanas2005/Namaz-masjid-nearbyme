const express = require('express');
const router = express.Router();
const Mosque = require('../models/Mosque');
const { body, param, query, validationResult } = require('express-validator');

// Get nearby mosques
router.get('/nearby', [
  query('latitude').isFloat({ min: -90, max: 90 }),
  query('longitude').isFloat({ min: -180, max: 180 }),
  query('radius').optional().isFloat({ min: 0, max: 50 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { latitude, longitude, radius = 10 } = req.query;

    const mosques = await Mosque.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: parseFloat(radius) * 1000, // Convert km to meters
        },
      },
    }).limit(50);

    // Calculate distance for each mosque
    const mosquesWithDistance = mosques.map(mosque => {
      const distance = calculateDistance(
        parseFloat(latitude),
        parseFloat(longitude),
        mosque.location.coordinates[1],
        mosque.location.coordinates[0]
      );
      
      return {
        ...mosque.toObject(),
        distance,
      };
    });

    res.json(mosquesWithDistance);
  } catch (error) {
    console.error('Error fetching nearby mosques:', error);
    res.status(500).json({ error: 'Failed to fetch mosques' });
  }
});

// Search mosques
router.get('/search', [
  query('q').notEmpty().trim(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { q } = req.query;

    const mosques = await Mosque.find({
      $text: { $search: q },
    }).limit(20);

    res.json(mosques);
  } catch (error) {
    console.error('Error searching mosques:', error);
    res.status(500).json({ error: 'Failed to search mosques' });
  }
});

// Get mosque by ID
router.get('/:id', [
  param('id').isMongoId(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mosque = await Mosque.findById(req.params.id);
    
    if (!mosque) {
      return res.status(404).json({ error: 'Mosque not found' });
    }

    res.json(mosque);
  } catch (error) {
    console.error('Error fetching mosque:', error);
    res.status(500).json({ error: 'Failed to fetch mosque' });
  }
});

// Update crowd density
router.post('/:id/crowd-density', [
  param('id').isMongoId(),
  body('userId').notEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mosque = await Mosque.findById(req.params.id);
    
    if (!mosque) {
      return res.status(404).json({ error: 'Mosque not found' });
    }

    // Update crowd density
    mosque.crowdDensity.currentCount += 1;
    mosque.crowdDensity.lastUpdated = new Date();
    
    // Calculate new average
    const alpha = 0.1;
    mosque.crowdDensity.averageCount = 
      mosque.crowdDensity.averageCount + 
      alpha * (mosque.crowdDensity.currentCount - mosque.crowdDensity.averageCount);

    await mosque.save();

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`mosque:${mosque._id}`).emit('crowdDensityUpdate', mosque.crowdDensity);

    res.json(mosque.crowdDensity);
  } catch (error) {
    console.error('Error updating crowd density:', error);
    res.status(500).json({ error: 'Failed to update crowd density' });
  }
});

// Helper function to calculate distance
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

module.exports = router;

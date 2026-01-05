const express = require('express');
const router = express.Router();
const Mosque = require('../models/Mosque');
const { body, param, validationResult } = require('express-validator');

// Submit committee approval
router.post('/approval', [
  body('mosqueId').isMongoId(),
  body('committeeId').notEmpty(),
  body('committeeMemberName').notEmpty().trim(),
  body('approvedPrayerTimes').isObject(),
  body('endorsementNote').optional().trim(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { mosqueId, approvedPrayerTimes, endorsementNote } = req.body;

    const mosque = await Mosque.findById(mosqueId);
    
    if (!mosque) {
      return res.status(404).json({ error: 'Mosque not found' });
    }

    // Update mosque with committee approval
    mosque.prayerTimes = {
      ...approvedPrayerTimes,
      lastUpdated: new Date(),
      isValidated: true,
    };
    mosque.committeeApproved = true;
    mosque.committeeApprovalDate = new Date();

    await mosque.save();

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`mosque:${mosqueId}`).emit('committeeApproval', {
      mosqueId,
      approved: true,
      prayerTimes: mosque.prayerTimes,
      endorsementNote,
    });

    res.json({
      message: 'Committee approval submitted successfully',
      mosque,
    });
  } catch (error) {
    console.error('Error submitting committee approval:', error);
    res.status(500).json({ error: 'Failed to submit approval' });
  }
});

// Get committee approvals for a mosque
router.get('/:mosqueId/approvals', [
  param('mosqueId').isMongoId(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mosque = await Mosque.findById(req.params.mosqueId);
    
    if (!mosque) {
      return res.status(404).json({ error: 'Mosque not found' });
    }

    res.json({
      committeeApproved: mosque.committeeApproved,
      committeeApprovalDate: mosque.committeeApprovalDate,
      prayerTimes: mosque.prayerTimes,
    });
  } catch (error) {
    console.error('Error fetching committee approvals:', error);
    res.status(500).json({ error: 'Failed to fetch approvals' });
  }
});

module.exports = router;

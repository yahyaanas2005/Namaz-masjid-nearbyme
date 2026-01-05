const express = require('express');
const router = express.Router();
const PrayerTimeReport = require('../models/PrayerTimeReport');
const Mosque = require('../models/Mosque');
const { body, param, validationResult } = require('express-validator');

// Submit prayer time report
router.post('/report', [
  body('mosqueId').isMongoId(),
  body('userId').notEmpty(),
  body('prayerName').isIn(['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'jumah']),
  body('reportedTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { mosqueId, userId, prayerName, reportedTime, season } = req.body;

    // Create new report
    const report = new PrayerTimeReport({
      mosqueId,
      userId,
      prayerName,
      reportedTime,
      season: season || getCurrentSeason(),
    });

    await report.save();

    // Check if prayer time should be validated
    const io = req.app.get('io');
    await validatePrayerTime(mosqueId, prayerName, io);

    res.status(201).json(report);
  } catch (error) {
    console.error('Error submitting prayer time report:', error);
    res.status(500).json({ error: 'Failed to submit report' });
  }
});

// Get validated prayer times
router.get('/:mosqueId/validated', [
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

    res.json(mosque.prayerTimes);
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    res.status(500).json({ error: 'Failed to fetch prayer times' });
  }
});

// Helper function to validate prayer time
async function validatePrayerTime(mosqueId, prayerName, io) {
  const threshold = parseInt(process.env.PRAYER_TIME_VALIDATION_THRESHOLD || '50');
  
  // Get all reports for this prayer
  const reports = await PrayerTimeReport.find({ mosqueId, prayerName });
  
  if (reports.length < threshold) {
    return;
  }

  // Count occurrences of each time
  const timeCount = {};
  reports.forEach(report => {
    timeCount[report.reportedTime] = (timeCount[report.reportedTime] || 0) + 1;
  });

  // Find the most reported time
  const mostReportedTime = Object.keys(timeCount).reduce((a, b) => 
    timeCount[a] > timeCount[b] ? a : b
  );

  const validationCount = timeCount[mostReportedTime];

  if (validationCount >= threshold) {
    // Update mosque prayer times
    const mosque = await Mosque.findById(mosqueId);
    mosque.prayerTimes[prayerName] = mostReportedTime;
    mosque.prayerTimes.validatedByCount = validationCount;
    mosque.prayerTimes.isValidated = true;
    mosque.prayerTimes.lastUpdated = new Date();
    await mosque.save();

    // Emit real-time update if io is available
    if (io) {
      io.to(`mosque:${mosqueId}`).emit('prayerTimeUpdate', {
        prayerName,
        time: mostReportedTime,
        validatedByCount: validationCount,
      });
    }
  }
}

// Helper function to get current season
function getCurrentSeason() {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
}

module.exports = router;

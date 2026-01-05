const mongoose = require('mongoose');

const prayerTimeReportSchema = new mongoose.Schema({
  mosqueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mosque',
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  prayerName: {
    type: String,
    enum: ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'jumah'],
    required: true,
  },
  reportedTime: {
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
  },
  season: {
    type: String,
    enum: ['winter', 'summer', 'spring', 'fall'],
  },
}, {
  timestamps: true,
});

// Indexes
prayerTimeReportSchema.index({ mosqueId: 1, prayerName: 1 });
prayerTimeReportSchema.index({ userId: 1 });

module.exports = mongoose.model('PrayerTimeReport', prayerTimeReportSchema);

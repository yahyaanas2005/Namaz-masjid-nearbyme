const mongoose = require('mongoose');

const mosqueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100,
  },
  address: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function(coords) {
          return coords.length === 2 && 
                 coords[1] >= -90 && coords[1] <= 90 &&
                 coords[0] >= -180 && coords[0] <= 180;
        },
        message: 'Invalid coordinates',
      },
    },
  },
  prayerTimes: {
    fajr: { type: String, required: true },
    dhuhr: { type: String, required: true },
    asr: { type: String, required: true },
    maghrib: { type: String, required: true },
    isha: { type: String, required: true },
    jumah: { type: String },
    lastUpdated: { type: Date, default: Date.now },
    validatedByCount: { type: Number, default: 0 },
    isValidated: { type: Boolean, default: false },
  },
  committeeApproved: {
    type: Boolean,
    default: false,
  },
  committeeApprovalDate: {
    type: Date,
  },
  crowdDensity: {
    currentCount: { type: Number, default: 0 },
    averageCount: { type: Number, default: 0 },
    peakHours: {
      type: Map,
      of: Number,
      default: {},
    },
    lastUpdated: { type: Date, default: Date.now },
  },
  facilities: [{
    type: String,
  }],
  photoUrl: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  website: {
    type: String,
  },
}, {
  timestamps: true,
});

// Geospatial index for location queries
mosqueSchema.index({ location: '2dsphere' });

// Text index for search
mosqueSchema.index({ name: 'text', address: 'text' });

module.exports = mongoose.model('Mosque', mosqueSchema);

const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  mosqueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mosque',
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 500,
  },
  prayerTimeAccuracy: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  facilities: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  cleanliness: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  likes: {
    type: Number,
    default: 0,
  },
  likedBy: [{
    type: String,
  }],
}, {
  timestamps: true,
});

// Indexes
testimonialSchema.index({ mosqueId: 1, createdAt: -1 });
testimonialSchema.index({ userId: 1 });

module.exports = mongoose.model('Testimonial', testimonialSchema);

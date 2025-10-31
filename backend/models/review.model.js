const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  reviewer: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Only admin
  rating: { type: Number, min: 1, max: 5, required: true },
  performanceComment: { type: String },
  strengths: [String],
  improvements: [String],
  overallFeedback: String,
  reviewDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['draft', 'final'], default: 'final' }
}, { timestamps: true });

// One review per project by admin
ReviewSchema.index({ project: 1, reviewer: 1 }, { unique: true });

module.exports = mongoose.model('Review', ReviewSchema);

const express = require('express');
const router = express.Router();
const Review = require('../models/review.model');
const Project = require('../models/project.model');
const { verifyToken, isAdmin } = require('../middleware/middleware');

// Create/Update review for a project (admin only)
router.post('/:projectId', verifyToken, isAdmin, async (req, res) => {
  try {
    const { rating, performanceComment, strengths, improvements, overallFeedback, status } = req.body;
    const { projectId } = req.params;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Upsert review
    let review = await Review.findOne({ project: projectId, reviewer: req.user.id });
    
    if (review) {
      // Update existing review
      review.rating = rating;
      review.performanceComment = performanceComment;
      review.strengths = strengths || [];
      review.improvements = improvements || [];
      review.overallFeedback = overallFeedback;
      review.status = status || 'final';
      review.reviewDate = new Date();
      await review.save();
    } else {
      // Create new review
      review = new Review({
        project: projectId,
        reviewer: req.user.id,
        rating,
        performanceComment,
        strengths: strengths || [],
        improvements: improvements || [],
        overallFeedback,
        status: status || 'final'
      });
      await review.save();
    }
    
    const populatedReview = await Review.findById(review._id)
      .populate('project', 'name status description employees')
      .populate('reviewer', 'name email');
    
    res.json({ message: 'Review saved successfully', review: populatedReview });
  } catch (error) {
    console.error('Review error:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

// Get all reviews (admin only)
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('project', 'name status description employees')
      .populate('reviewer', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reviews', details: error.message });
  }
});

// Get projects with their reviews (admin only)
router.get('/projects-with-reviews', verifyToken, isAdmin, async (req, res) => {
  try {
    const projects = await Project.find().populate('employees', 'name email');
    const reviews = await Review.find().populate('reviewer', 'name email');
    
    const projectsWithReviews = projects.map(project => {
      const projectReview = reviews.find(review => 
        review.project.toString() === project._id.toString()
      );
      
      return {
        ...project.toObject(),
        review: projectReview,
        hasReview: !!projectReview
      };
    });
    
    res.json({ projects: projectsWithReviews });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch projects', details: error.message });
  }
});

// Delete review (admin only)
router.delete('/:reviewId', verifyToken, isAdmin, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    await Review.findByIdAndDelete(req.params.reviewId);
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete review', details: error.message });
  }
});

module.exports = router;

import React, { useEffect, useState } from 'react';
import api  from '../services/api';
import { Star, MessageSquare, Edit, Plus, X, Save, Award, Sparkles, Eye, Calendar, User, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function AdminReviews() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reviewModal, setReviewModal] = useState(null); // {project, existingReview?}
  const [filter, setFilter] = useState('all'); // all, reviewed, unreviewed, pending
  const [searchTerm, setSearchTerm] = useState('');

  // Enhanced form state for review
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    performanceComment: '',
    strengths: [''],
    improvements: [''],
    overallFeedback: '',
    status: 'final',
    nextSteps: [''],
    deadline: '',
    priority: 'medium',
    reviewerNotes: '',
    teamFeedback: '',
    technicalSkills: 5,
    communication: 5,
    leadership: 5,
    productivity: 5,
    innovation: 5
  });

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    loadProjectsWithReviews();
  }, []);

  const loadProjectsWithReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reviews/projects-with-reviews');
      setProjects(res.data.projects || []);
    } catch (error) {
      toast.error('Failed to load projects');
      console.error('Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const openReviewModal = (project) => {
    const existingReview = project.review;
    
    if (existingReview) {
      setReviewForm({
        rating: existingReview.rating || 5,
        performanceComment: existingReview.performanceComment || '',
        strengths: existingReview.strengths?.length > 0 ? existingReview.strengths : [''],
        improvements: existingReview.improvements?.length > 0 ? existingReview.improvements : [''],
        overallFeedback: existingReview.overallFeedback || '',
        status: existingReview.status || 'final',
        nextSteps: existingReview.nextSteps?.length > 0 ? existingReview.nextSteps : [''],
        deadline: existingReview.deadline ? dayjs(existingReview.deadline).format('YYYY-MM-DD') : '',
        priority: existingReview.priority || 'medium',
        reviewerNotes: existingReview.reviewerNotes || '',
        teamFeedback: existingReview.teamFeedback || '',
        technicalSkills: existingReview.technicalSkills || 5,
        communication: existingReview.communication || 5,
        leadership: existingReview.leadership || 5,
        productivity: existingReview.productivity || 5,
        innovation: existingReview.innovation || 5
      });
    } else {
      setReviewForm({
        rating: 5,
        performanceComment: '',
        strengths: [''],
        improvements: [''],
        overallFeedback: '',
        status: 'final',
        nextSteps: [''],
        deadline: '',
        priority: 'medium',
        reviewerNotes: '',
        teamFeedback: '',
        technicalSkills: 5,
        communication: 5,
        leadership: 5,
        productivity: 5,
        innovation: 5
      });
    }
    
    setReviewModal({ project, existingReview });
  };

  const closeReviewModal = () => {
    setReviewModal(null);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    
    // Clean up empty strings from arrays
    const cleanedForm = {
      ...reviewForm,
      strengths: reviewForm.strengths.filter(s => s.trim() !== ''),
      improvements: reviewForm.improvements.filter(i => i.trim() !== ''),
      nextSteps: reviewForm.nextSteps.filter(n => n.trim() !== ''),
      deadline: reviewForm.deadline ? new Date(reviewForm.deadline) : null
    };

    try {
      await api.post(`/reviews/${reviewModal.project._id}`, cleanedForm);
      toast.success('Review saved successfully!');
      closeReviewModal();
      loadProjectsWithReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save review');
    }
  };

  const deleteReview = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) return;
    
    try {
      await api.delete(`/reviews/${projectId}`);
      toast.success('Review deleted successfully!');
      loadProjectsWithReviews();
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  const addArrayField = (field) => {
    setReviewForm(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field, index) => {
    setReviewForm(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateArrayField = (field, index, value) => {
    setReviewForm(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700';
      case 'in-progress': return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700';
      case 'not-started': return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700';
      case 'low': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    }
  };

  const renderStars = (rating, onChange = null, name = '') => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={24}
        className={`cursor-pointer transition-colors ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300 hover:text-yellow-200'
        }`}
        onClick={() => onChange && onChange(i + 1)}
      />
    ));
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === 'reviewed') return project.hasReview && matchesSearch;
    if (filter === 'unreviewed') return !project.hasReview && matchesSearch;
    if (filter === 'pending') return project.review?.status === 'pending' && matchesSearch;
    return matchesSearch;
  });

  const reviewStats = {
    total: projects.length,
    reviewed: projects.filter(p => p.hasReview).length,
    unreviewed: projects.filter(p => !p.hasReview).length,
    pending: projects.filter(p => p.review?.status === 'pending').length,
    avgRating: projects.filter(p => p.review?.rating).reduce((sum, p) => sum + p.review.rating, 0) / Math.max(projects.filter(p => p.review?.rating).length, 1)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 py-8 px-4 sm:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Project Performance Reviews
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Comprehensive project evaluation system with detailed performance metrics and feedback management
          </p>
        </div>

        {/* Enhanced Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{reviewStats.total}</div>
                <div className="text-sm text-gray-500">Total Projects</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{reviewStats.reviewed}</div>
                <div className="text-sm text-gray-500">Reviewed</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                <Edit className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{reviewStats.unreviewed}</div>
                <div className="text-sm text-gray-500">Pending Review</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {reviewStats.avgRating.toFixed(1)}
                </div>
                <div className="text-sm text-gray-500">Avg Rating</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{reviewStats.pending}</div>
                <div className="text-sm text-gray-500">Draft Reviews</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Filter and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white w-full sm:w-64"
              />
              
              <div className="flex space-x-2">
                {[
                  { id: 'all', label: 'All Projects', count: reviewStats.total },
                  { id: 'reviewed', label: 'Reviewed', count: reviewStats.reviewed },
                  { id: 'unreviewed', label: 'Unreviewed', count: reviewStats.unreviewed },
                  { id: 'pending', label: 'Draft', count: reviewStats.pending }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setFilter(tab.id)}
                    className={`px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                      filter === tab.id
                        ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Projects Grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project._id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {project.name}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(project.status)}`}>
                        {project.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                      {project.review?.priority && (
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(project.review.priority)}`}>
                          {project.review.priority.toUpperCase()} PRIORITY
                        </span>
                      )}
                    </div>
                    
                    {project.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {project.description}
                      </p>
                    )}

                    {/* Team Members */}
                    <div className="flex items-center space-x-2 mb-3">
                      <User className="w-4 h-4 text-gray-500" />
                      <div className="flex flex-wrap gap-2">
                        {project.employees?.slice(0, 3).map((emp) => (
                          <span
                            key={emp._id}
                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-medium"
                          >
                            {emp.name}
                          </span>
                        ))}
                        {project.employees?.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs">
                            +{project.employees.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Review Status */}
                    {project.hasReview ? (
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="flex">{renderStars(project.review.rating)}</div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              ({project.review.rating}/5)
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            Reviewed on {dayjs(project.review.reviewDate).format('MMM DD, YYYY')}
                          </span>
                        </div>
                        
                        {project.review.overallFeedback && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            "{project.review.overallFeedback.substring(0, 100)}..."
                          </p>
                        )}

                        {project.review.deadline && (
                          <div className="flex items-center space-x-2 mt-2 text-sm text-orange-600">
                            <Calendar className="w-4 h-4" />
                            <span>Deadline: {dayjs(project.review.deadline).format('MMM DD, YYYY')}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4">
                        <div className="flex items-center space-x-2 text-orange-600">
                          <Sparkles className="w-4 h-4" />
                          <span className="text-sm font-medium">Awaiting Performance Review</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {project.hasReview && (
                      <button
                        onClick={() => deleteReview(project._id)}
                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Delete Review"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => openReviewModal(project)}
                      className={`flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                        project.hasReview
                          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50'
                          : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg transform hover:-translate-y-1'
                      }`}
                    >
                      {project.hasReview ? (
                        <>
                          <Edit className="w-4 h-4 mr-2" />
                          Update Review
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Review
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredProjects.length === 0 && (
              <div className="text-center py-16">
                <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  No projects found
                </h3>
                <p className="text-gray-500">
                  {filter === 'unreviewed' 
                    ? 'All projects have been reviewed!' 
                    : filter === 'reviewed'
                    ? 'No reviewed projects yet'
                    : searchTerm
                    ? 'Try adjusting your search terms'
                    : 'No projects available'
                  }
                </p>
              </div>
            )}
          </div>
        )}

        {/* Enhanced Review Modal */}
        {reviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={closeReviewModal}
            />
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <form onSubmit={submitReview} className="p-8 space-y-8">
                {/* Modal Header */}
                <div className="flex justify-between items-center pb-6 border-b border-gray-200 dark:border-gray-600">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                    <Award className="w-6 h-6" />
                    <span>Review: {reviewModal.project.name}</span>
                  </h2>
                  <button
                    type="button"
                    onClick={closeReviewModal}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Overall Rating */}
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6">
                      <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                        Overall Rating <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center space-x-3">
                        <div className="flex space-x-1">
                          {renderStars(reviewForm.rating, (rating) => 
                            setReviewForm(prev => ({...prev, rating}))
                          )}
                        </div>
                        <span className="text-2xl font-bold text-yellow-600">
                          {reviewForm.rating}/5
                        </span>
                      </div>
                    </div>

                    {/* Performance Skills */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                        Performance Metrics
                      </h3>
                      <div className="space-y-4">
                        {[
                          { key: 'technicalSkills', label: 'Technical Skills' },
                          { key: 'communication', label: 'Communication' },
                          { key: 'leadership', label: 'Leadership' },
                          { key: 'productivity', label: 'Productivity' },
                          { key: 'innovation', label: 'Innovation' }
                        ].map(({ key, label }) => (
                          <div key={key}>
                            <div className="flex justify-between items-center mb-2">
                              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                {label}
                              </label>
                              <span className="text-sm font-bold text-blue-600">
                                {reviewForm[key]}/5
                              </span>
                            </div>
                            <div className="flex space-x-1">
                              {renderStars(reviewForm[key], (rating) => 
                                setReviewForm(prev => ({...prev, [key]: rating}))
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Priority and Status */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Priority Level
                        </label>
                        <select
                          value={reviewForm.priority}
                          onChange={(e) => setReviewForm(prev => ({...prev, priority: e.target.value}))}
                          className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="low">Low Priority</option>
                          <option value="medium">Medium Priority</option>
                          <option value="high">High Priority</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Review Status
                        </label>
                        <select
                          value={reviewForm.status}
                          onChange={(e) => setReviewForm(prev => ({...prev, status: e.target.value}))}
                          className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="draft">Draft</option>
                          <option value="pending">Pending Approval</option>
                          <option value="final">Final</option>
                        </select>
                      </div>
                    </div>

                    {/* Deadline */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Next Review Deadline
                      </label>
                      <input
                        type="date"
                        value={reviewForm.deadline}
                        onChange={(e) => setReviewForm(prev => ({...prev, deadline: e.target.value}))}
                        className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Performance Comments */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Performance Comments
                      </label>
                      <textarea
                        rows={4}
                        value={reviewForm.performanceComment}
                        onChange={(e) => setReviewForm(prev => ({...prev, performanceComment: e.target.value}))}
                        className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Detailed assessment of project performance..."
                      />
                    </div>

                    {/* Strengths */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Project Strengths
                      </label>
                      {reviewForm.strengths.map((strength, index) => (
                        <div key={index} className="flex items-center space-x-2 mb-2">
                          <input
                            type="text"
                            value={strength}
                            onChange={(e) => updateArrayField('strengths', index, e.target.value)}
                            className="flex-1 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="What worked well in this project?"
                          />
                          {reviewForm.strengths.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeArrayField('strengths', index)}
                              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addArrayField('strengths')}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        + Add another strength
                      </button>
                    </div>

                    {/* Areas for Improvement */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Areas for Improvement
                      </label>
                      {reviewForm.improvements.map((improvement, index) => (
                        <div key={index} className="flex items-center space-x-2 mb-2">
                          <input
                            type="text"
                            value={improvement}
                            onChange={(e) => updateArrayField('improvements', index, e.target.value)}
                            className="flex-1 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="What could be improved?"
                          />
                          {reviewForm.improvements.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeArrayField('improvements', index)}
                              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addArrayField('improvements')}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        + Add another improvement area
                      </button>
                    </div>

                    {/* Next Steps */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Next Steps & Action Items
                      </label>
                      {reviewForm.nextSteps.map((step, index) => (
                        <div key={index} className="flex items-center space-x-2 mb-2">
                          <input
                            type="text"
                            value={step}
                            onChange={(e) => updateArrayField('nextSteps', index, e.target.value)}
                            className="flex-1 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Recommended action or next step..."
                          />
                          {reviewForm.nextSteps.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeArrayField('nextSteps', index)}
                              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addArrayField('nextSteps')}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        + Add next step
                      </button>
                    </div>
                  </div>
                </div>

                {/* Additional Fields */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Team Feedback
                    </label>
                    <textarea
                      rows={3}
                      value={reviewForm.teamFeedback}
                      onChange={(e) => setReviewForm(prev => ({...prev, teamFeedback: e.target.value}))}
                      className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Feedback from team members..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Reviewer Notes (Internal)
                    </label>
                    <textarea
                      rows={3}
                      value={reviewForm.reviewerNotes}
                      onChange={(e) => setReviewForm(prev => ({...prev, reviewerNotes: e.target.value}))}
                      className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Internal notes for management..."
                    />
                  </div>
                </div>

                {/* Overall Feedback */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Overall Feedback & Summary
                  </label>
                  <textarea
                    rows={4}
                    value={reviewForm.overallFeedback}
                    onChange={(e) => setReviewForm(prev => ({...prev, overallFeedback: e.target.value}))}
                    className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Comprehensive summary of the project performance and recommendations..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-600">
                  <button
                    type="button"
                    onClick={closeReviewModal}
                    className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg font-medium transition-all duration-200 flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Review</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { employeeAPI, profilePhotoAPI, authAPI } from '../services/api';
import { User, Camera, Lock, Save, Edit, Mail, Building, Shield, Upload, Download, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || '',
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchProfilePhoto();
  }, []);

  const fetchProfilePhoto = async () => {
    try {
      const response = await profilePhotoAPI.downloadPhoto();
      const imageUrl = URL.createObjectURL(response.data);
      setProfilePhoto(imageUrl);
    } catch (error) {
      // No profile photo exists
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await employeeAPI.updateProfile(profileForm);
      updateUser(response.data.user);
      setEditMode(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await authAPI.changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });
      
      toast.success('Password changed successfully!');
      setPasswordForm({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  console.log('Selected file:', {
    name: file.name,
    type: file.type,
    size: file.size
  });

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    toast.error('Please upload a JPEG, JPG, or PNG file');
    return;
  }

  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    toast.error('File size must be less than 5MB');
    return;
  }

  const formData = new FormData();
  formData.append('profilep', file);
  
  const fileFormat = file.type.replace('image/', '');
  formData.append('fileFormat', fileFormat);

  console.log('FormData entries:');
  for (let pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }

  setLoading(true);

  try {
    console.log('Starting upload...');
    const response = await profilePhotoAPI.uploadPhoto(formData);
    console.log('Upload response:', response);
    toast.success('Profile photo uploaded successfully!');
    fetchProfilePhoto();
  } catch (error) {
    console.error('Upload error:', error);
    toast.error(error.message || 'Failed to upload profile photo');
  } finally {
    setLoading(false);
  }
};

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: User },
    { id: 'photo', label: 'Profile Photo', icon: Camera },
    { id: 'password', label: 'Security', icon: Lock },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-8 py-12 relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10 flex items-center space-x-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-white/20 backdrop-blur-sm border-4 border-white/30">
                  {profilePhoto ? (
                    <img
                      src={profilePhoto}
                      alt="Profile"
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => setShowImageModal(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-12 h-12 text-white" />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => document.getElementById('photo-upload').click()}
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-white text-blue-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group-hover:scale-110"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
              
              <div className="text-white">
                <h1 className="text-3xl font-bold mb-2">
                  {user?.name || 'Your Profile'}
                </h1>
                <p className="text-blue-100 text-lg mb-1">{user?.email}</p>
                <div className="flex items-center space-x-4 text-blue-100">
                  <div className="flex items-center space-x-1">
                    <Shield className="w-4 h-4" />
                    <span className="capitalize">{user?.role}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Building className="w-4 h-4" />
                    <span>{user?.department || 'No Department'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-0">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center space-x-3 px-8 py-6 font-medium text-lg transition-all duration-300 relative ${
                    activeTab === id
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                  {activeTab === id && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {/* Profile Information Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
                  >
                    <Edit className="w-4 h-4" />
                    <span>{editMode ? 'Cancel' : 'Edit'}</span>
                  </button>
                </div>

                {editMode ? (
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            value={profileForm.name}
                            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Enter your full name"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="email"
                            value={profileForm.email}
                            onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Department
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            value={profileForm.department}
                            onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Enter your department"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        <span>{loading ? 'Updating...' : 'Update Profile'}</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl">
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">Personal Information</h3>
                        <div className="space-y-3">
                          <div>
                            <span className="text-blue-700 font-medium">Full Name:</span>
                            <p className="text-blue-900 text-lg">{profileForm.name || 'Not set'}</p>
                          </div>
                          <div>
                            <span className="text-blue-700 font-medium">Email:</span>
                            <p className="text-blue-900">{profileForm.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl">
                        <h3 className="text-lg font-semibold text-purple-900 mb-2">Work Information</h3>
                        <div className="space-y-3">
                          <div>
                            <span className="text-purple-700 font-medium">Department:</span>
                            <p className="text-purple-900 text-lg">{profileForm.department || 'Not assigned'}</p>
                          </div>
                          <div>
                            <span className="text-purple-700 font-medium">Role:</span>
                            <p className="text-purple-900 capitalize">{user?.role}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profile Photo Tab */}
            {activeTab === 'photo' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-gray-900">Profile Photo</h2>
                
                <div className="flex flex-col lg:flex-row items-center space-y-8 lg:space-y-0 lg:space-x-12">
                  <div className="text-center">
                    <div className="relative inline-block">
                      <div className="w-40 h-40 rounded-full overflow-hidden bg-gradient-to-r from-blue-100 to-purple-100 border-4 border-white shadow-2xl">
                        {profilePhoto ? (
                          <img
                            src={profilePhoto}
                            alt="Profile"
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => setShowImageModal(true)}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-20 h-20 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => document.getElementById('photo-upload-tab').click()}
                        className="absolute -bottom-4 -right-4 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center"
                      >
                        <Camera className="w-6 h-6" />
                      </button>
                    </div>
                    
                    <input
                      id="photo-upload-tab"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      disabled={loading}
                    />
                  </div>

                  <div className="flex-1 space-y-6">
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-yellow-800 mb-3">Photo Guidelines</h3>
                      <ul className="space-y-2 text-yellow-700">
                        <li className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span>Supported formats: JPEG, JPG, PNG</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span>Maximum file size: 5MB</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span>Recommended: Square image (400x400px)</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span>Clear face photo for better recognition</span>
                        </li>
                      </ul>
                    </div>

                    <div className="flex space-x-4">
                      <label className="flex-1 btn-primary cursor-pointer text-center">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload New Photo
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png"
                          onChange={handlePhotoUpload}
                          className="hidden"
                          disabled={loading}
                        />
                      </label>
                      
                      {profilePhoto && (
                        <button
                          onClick={() => setShowImageModal(true)}
                          className="flex-1 btn-secondary flex items-center justify-center"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          View Full Size
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Change Password Tab */}
            {activeTab === 'password' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
                
                <form onSubmit={handlePasswordChange} className="max-w-md space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="password"
                        value={passwordForm.oldPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter current password"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter new password"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Confirm new password"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Requirements */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-3">Password Requirements:</h4>
                    <ul className="space-y-2 text-blue-700">
                      <li className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${passwordForm.newPassword.length >= 6 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span>At least 6 characters</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${passwordForm.newPassword === passwordForm.confirmPassword && passwordForm.newPassword ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span>Passwords match</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${passwordForm.oldPassword ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span>Current password provided</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Changing Password...</span>
                      </div>
                    ) : (
                      'Change Password'
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Image Modal */}
        {showImageModal && profilePhoto && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setShowImageModal(false)}>
            <div className="relative max-w-2xl max-h-2xl">
              <img
                src={profilePhoto}
                alt="Profile Full Size"
                className="max-w-full max-h-full rounded-2xl shadow-2xl"
              />
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-white text-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

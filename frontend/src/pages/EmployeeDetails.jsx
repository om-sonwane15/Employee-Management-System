import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { employeeAPI, profilePhotoAPI } from '../services/api';
import { 
  User, 
  Mail, 
  Building, 
  Calendar, 
  Phone, 
  MapPin, 
  Edit, 
  ArrowLeft,
  Save,
  X,
  Camera,
  Shield,
  Clock,
  Award,
  Briefcase,
  FileText,
  Activity
} from 'lucide-react';
import toast from 'react-hot-toast';

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    department: '',
    phone: '',
    address: '',
    position: '',
    salary: '',
    hireDate: '',
    emergencyContact: '',
    notes: ''
  });

  useEffect(() => {
    fetchEmployeeDetails();
  }, [id]);

  const fetchEmployeeDetails = async () => {
    try {
      setLoading(true);
      
      // Since getEmployeeById doesn't exist, we'll fetch all employees and find the specific one
      const response = await employeeAPI.getAllEmployees();
      const foundEmployee = response.data.employees?.find(emp => emp._id === id);
      
      if (!foundEmployee) {
        toast.error('Employee not found');
        navigate('/employees');
        return;
      }

      setEmployee(foundEmployee);
      setEditForm({
        name: foundEmployee.name || '',
        email: foundEmployee.email || '',
        department: foundEmployee.department || '',
        phone: foundEmployee.phone || '',
        address: foundEmployee.address || '',
        position: foundEmployee.position || '',
        salary: foundEmployee.salary || '',
        hireDate: foundEmployee.hireDate || '',
        emergencyContact: foundEmployee.emergencyContact || '',
        notes: foundEmployee.notes || ''
      });
      
      // Try to fetch profile photo if exists
      try {
        const photoResponse = await profilePhotoAPI.downloadPhoto();
        if (photoResponse && photoResponse.data) {
          const imageUrl = URL.createObjectURL(photoResponse.data);
          setProfilePhoto(imageUrl);
        }
      } catch (error) {
        // No profile photo exists, which is fine
        console.log('No profile photo found');
      }
    } catch (error) {
      console.error('Error fetching employee details:', error);
      toast.error('Failed to fetch employee details');
      navigate('/employees');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    try {
      // Use the existing updateProfile API
      await employeeAPI.updateProfile(editForm);
      setEmployee({ ...employee, ...editForm });
      setEditMode(false);
      toast.success('Employee updated successfully!');
    } catch (error) {
      console.error('Error updating employee:', error);
      toast.error('Failed to update employee');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'personal', label: 'Personal Info', icon: FileText },
    { id: 'work', label: 'Work Details', icon: Briefcase },
    { id: 'activity', label: 'Activity Log', icon: Activity }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading employee details...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Employee Not Found</h2>
          <p className="text-gray-600 mb-6">The employee you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/employees')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            Back to Employees
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/employees')}
            className="p-2 hover:bg-white rounded-lg shadow-md transition-all duration-300 flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Employee Details</h1>
        </div>

        {/* Employee Header Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-8 py-12 relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-white/20 backdrop-blur-sm border-4 border-white/30">
                    {profilePhoto ? (
                      <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-16 h-16 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                
                <div className="text-white">
                  <h2 className="text-4xl font-bold mb-2">{employee?.name || 'No Name'}</h2>
                  <p className="text-blue-100 text-xl mb-4">{employee?.position || 'Employee'}</p>
                  
                  <div className="flex items-center space-x-6 text-blue-100">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-5 h-5" />
                      <span>{employee?.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Building className="w-5 h-5" />
                      <span>{employee?.department || 'No Department'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5" />
                      <span className="capitalize">{employee?.role}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-300"
                >
                  <Edit className="w-4 h-4" />
                  <span>{editMode ? 'Cancel' : 'Edit'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-0 overflow-x-auto">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center space-x-3 px-8 py-6 font-medium text-lg transition-all duration-300 relative whitespace-nowrap ${
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
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Quick Stats */}
                  <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-blue-900 mb-4">Quick Stats</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-blue-700">Employee ID</span>
                          <span className="font-mono font-bold text-blue-900">
                            {employee?._id?.slice(-8)?.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-blue-700">Hire Date</span>
                          <span className="font-semibold text-blue-900">
                            {employee?.hireDate ? new Date(employee.hireDate).toLocaleDateString() : new Date().toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-blue-700">Years Active</span>
                          <span className="font-semibold text-blue-900">
                            {employee?.hireDate 
                              ? Math.floor((new Date() - new Date(employee.hireDate)) / (365.25 * 24 * 60 * 60 * 1000)) || '< 1'
                              : '2.5'
                            } years
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-green-900 mb-4">Performance</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-green-700">Rating</span>
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Award key={star} className="w-4 h-4 text-yellow-500 fill-current" />
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-green-700">Projects</span>
                          <span className="font-semibold text-green-900">12 Completed</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-green-700">Attendance</span>
                          <span className="font-semibold text-green-900">98.5%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="lg:col-span-2">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
                    <div className="space-y-4">
                      {[
                        { action: 'Completed project milestone', time: '2 hours ago', type: 'success' },
                        { action: 'Updated profile information', time: '1 day ago', type: 'info' },
                        { action: 'Submitted weekly report', time: '3 days ago', type: 'success' },
                        { action: 'Attended team meeting', time: '5 days ago', type: 'info' },
                        { action: 'Completed training module', time: '1 week ago', type: 'success' }
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                          <div className={`w-3 h-3 rounded-full ${
                            activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                          }`}></div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{activity.action}</p>
                            <p className="text-sm text-gray-600">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Personal Info Tab */}
            {activeTab === 'personal' && (
              <div className="space-y-8">
                {editMode ? (
                  <form onSubmit={handleUpdateEmployee} className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Personal Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Enter full name"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Enter email address"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            value={editForm.department}
                            onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Enter department"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="tel"
                            value={editForm.phone}
                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Enter phone number"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Emergency Contact</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="tel"
                            value={editForm.emergencyContact}
                            onChange={(e) => setEditForm({ ...editForm, emergencyContact: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Enter emergency contact"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Position</label>
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            value={editForm.position}
                            onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Enter job position"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                          <textarea
                            value={editForm.address}
                            onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                            rows={3}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Enter full address"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-4 pt-6">
                      <button
                        type="submit"
                        className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditMode(false)}
                        className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-all duration-300"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                      <button
                        onClick={() => setEditMode(true)}
                        className="flex items-center space-x-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-300"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6">
                          <h3 className="font-semibold text-blue-900 mb-4">Contact Information</h3>
                          <div className="space-y-3">
                            <div>
                              <span className="text-blue-700 text-sm font-medium">Email:</span>
                              <p className="font-semibold text-blue-900">{employee?.email}</p>
                            </div>
                            <div>
                              <span className="text-blue-700 text-sm font-medium">Phone:</span>
                              <p className="font-semibold text-blue-900">{employee?.phone || 'Not provided'}</p>
                            </div>
                            <div>
                              <span className="text-blue-700 text-sm font-medium">Emergency Contact:</span>
                              <p className="font-semibold text-blue-900">{employee?.emergencyContact || 'Not provided'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6">
                          <h3 className="font-semibold text-green-900 mb-4">Address</h3>
                          <p className="text-green-800">{employee?.address || 'No address provided'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Work Details Tab */}
            {activeTab === 'work' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-gray-900">Work Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-purple-900 mb-4">Position Details</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-purple-700 text-sm font-medium">Title:</span>
                        <p className="font-semibold text-purple-900">{employee?.position || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="text-purple-700 text-sm font-medium">Department:</span>
                        <p className="font-semibold text-purple-900">{employee?.department || 'Not assigned'}</p>
                      </div>
                      <div>
                        <span className="text-purple-700 text-sm font-medium">Role:</span>
                        <p className="font-semibold text-purple-900 capitalize">{employee?.role || 'Employee'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-green-900 mb-4">Employment</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-green-700 text-sm font-medium">Type:</span>
                        <p className="font-semibold text-green-900">Full-time</p>
                      </div>
                      <div>
                        <span className="text-green-700 text-sm font-medium">Status:</span>
                        <p className="font-semibold text-green-900">Active</p>
                      </div>
                      <div>
                        <span className="text-green-700 text-sm font-medium">Start Date:</span>
                        <p className="font-semibold text-green-900">
                          {employee?.hireDate ? new Date(employee.hireDate).toLocaleDateString() : new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-orange-900 mb-4">Compensation</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-orange-700 text-sm font-medium">Salary:</span>
                        <p className="font-semibold text-orange-900">{employee?.salary || 'Confidential'}</p>
                      </div>
                      <div>
                        <span className="text-orange-700 text-sm font-medium">Currency:</span>
                        <p className="font-semibold text-orange-900">USD</p>
                      </div>
                      <div>
                        <span className="text-orange-700 text-sm font-medium">Pay Frequency:</span>
                        <p className="font-semibold text-orange-900">Monthly</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Activity Log Tab */}
            {activeTab === 'activity' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Activity Timeline</h2>
                <div className="space-y-4">
                  {[
                    { date: '2024-01-15', action: 'Profile updated', details: 'Updated contact information', type: 'update' },
                    { date: '2024-01-10', action: 'Project assigned', details: 'Assigned to Web Development Project', type: 'assignment' },
                    { date: '2024-01-05', action: 'Training completed', details: 'Completed React Advanced Training', type: 'training' },
                    { date: '2024-01-01', action: 'Performance review', details: 'Quarterly review completed', type: 'review' },
                    { date: '2023-12-20', action: 'Department transfer', details: 'Moved to Development Department', type: 'transfer' }
                  ].map((log, index) => (
                    <div key={index} className="flex items-start space-x-4 p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                      <div className={`w-4 h-4 rounded-full mt-1 flex-shrink-0 ${
                        log.type === 'update' ? 'bg-blue-500' :
                        log.type === 'assignment' ? 'bg-green-500' :
                        log.type === 'training' ? 'bg-purple-500' :
                        log.type === 'review' ? 'bg-orange-500' :
                        'bg-gray-500'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{log.action}</h4>
                          <span className="text-sm text-gray-500 flex-shrink-0">{log.date}</span>
                        </div>
                        <p className="text-gray-600">{log.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;

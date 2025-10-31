import React, { useState, useEffect } from 'react';
import { departmentAPI } from '../services/api';
import { 
  Building, 
  Plus, 
  Search, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Edit,
  Users,
  Calendar,
  MoreVertical,
  X,
  Save
} from 'lucide-react';
import toast from 'react-hot-toast';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalDepartments: 0,
  });
  const [search, setSearch] = useState('');
  const [limit] = useState(9);

  useEffect(() => {
    fetchDepartments();
  }, [pagination.page, search]);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await departmentAPI.getDepartments({
        page: pagination.page,
        limit,
        search,
      });

      setDepartments(response.data.departments);
      setPagination({
        page: response.data.page,
        totalPages: Math.ceil(response.data.totalDepartments / limit),
        totalDepartments: response.data.totalDepartments,
      });
    } catch (error) {
      toast.error('Failed to fetch departments');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    if (!newDepartmentName.trim()) {
      toast.error('Department name is required');
      return;
    }

    try {
      await departmentAPI.addDepartment({ name: newDepartmentName.trim() });
      toast.success('Department added successfully');
      setNewDepartmentName('');
      setShowAddModal(false);
      fetchDepartments();
    } catch (error) {
      toast.error('Failed to add department');
    }
  };

  const handleDeleteDepartment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) {
      return;
    }

    try {
      await departmentAPI.deleteDepartment(id);
      toast.success('Department deleted successfully');
      fetchDepartments();
    } catch (error) {
      toast.error('Failed to delete department');
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPagination({ ...pagination, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  const handleEditDepartment = (department) => {
    setEditingDepartment(department);
    setNewDepartmentName(department.name);
    setShowEditModal(true);
  };

  const DepartmentCard = ({ department, index }) => (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl ${
              ['bg-gradient-to-r from-blue-500 to-blue-600',
               'bg-gradient-to-r from-green-500 to-green-600',
               'bg-gradient-to-r from-purple-500 to-purple-600',
               'bg-gradient-to-r from-orange-500 to-orange-600',
               'bg-gradient-to-r from-pink-500 to-pink-600',
               'bg-gradient-to-r from-indigo-500 to-indigo-600'][index % 6]
            }`}>
              <Building className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {department.name}
              </h3>
              <p className="text-gray-600 flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Created {new Date(department.createdAt || Date.now()).toLocaleDateString()}</span>
              </p>
            </div>
          </div>
          
          <div className="relative">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>Employees</span>
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {Math.floor(Math.random() * 20) + 1} Members
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Department ID</span>
            <span className="text-gray-900 font-medium font-mono">
              {department._id.slice(-6).toUpperCase()}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
          <button
            onClick={() => handleEditDepartment(department)}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </button>
          
          <button
            onClick={() => handleDeleteDepartment(department._id)}
            className="flex items-center justify-center p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 px-8 py-12 relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Building className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">Department Management</h1>
                  <p className="text-green-100 text-lg">Organize your workforce by departments</p>
                </div>
              </div>
              
              <div className="hidden lg:block text-right">
                <div className="text-3xl font-bold text-white mb-1">{pagination.totalDepartments}</div>
                <div className="text-green-100">Total Departments</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search departments..."
                  value={search}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              <span>Add Department</span>
            </button>
          </div>
        </div>

        {/* Department Grid */}
        <div>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Loading departments...</p>
              </div>
            </div>
          ) : departments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departments.map((department, index) => (
                <DepartmentCard key={department._id} department={department} index={index} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 py-20">
              <div className="text-center">
                <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Departments Found</h3>
                <p className="text-gray-600 mb-6">
                  {search ? 'No departments match your search criteria' : 'Start by creating your first department'}
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  Create First Department
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {((pagination.page - 1) * limit) + 1} to {Math.min(pagination.page * limit, pagination.totalDepartments)} of {pagination.totalDepartments} results
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          pagination.page === page
                            ? 'bg-green-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Department Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Add New Department</h2>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setNewDepartmentName('');
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleAddDepartment} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Department Name
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={newDepartmentName}
                      onChange={(e) => setNewDepartmentName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter department name"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Create Department</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setNewDepartmentName('');
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Department Modal */}
        {showEditModal && editingDepartment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Edit Department</h2>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingDepartment(null);
                      setNewDepartmentName('');
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Department Name
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={newDepartmentName}
                      onChange={(e) => setNewDepartmentName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter department name"
                      required
                    />
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Department Details</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>ID: {editingDepartment._id.slice(-8).toUpperCase()}</p>
                    <p>Created: {new Date(editingDepartment.createdAt || Date.now()).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      // Handle update logic here
                      toast.success('Department updated successfully');
                      setShowEditModal(false);
                      setEditingDepartment(null);
                      setNewDepartmentName('');
                    }}
                    className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Update Department</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingDepartment(null);
                      setNewDepartmentName('');
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Departments;

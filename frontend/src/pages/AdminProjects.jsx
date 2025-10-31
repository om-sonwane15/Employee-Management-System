import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  Loader2,
  X,
  Users,
  Calendar,
  BarChart3,
  Target,
  Clock,
  Award,
  TrendingUp,
  Sparkles
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function AdminProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null); // {mode: 'add'|'edit', data?}
  const [employees, setEmployees] = useState([]);

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    load();
    loadEmployees();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch (error) {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const res = await api.get("/employee/all");
      setEmployees(res.data.employees);
    } catch (error) {
      console.error("Failed to load employees");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete project?")) return;
    try {
      await api.delete(`/projects/${id}`);
      toast.success("Project deleted successfully!");
      load();
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  const save = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const body = {
      name: formData.get('name'),
      description: formData.get('description'),
      status: formData.get('status'),
      startDate: formData.get('startDate'),
      allottedDays: parseInt(formData.get('allottedDays')),
      employees: Array.from(formData.getAll('employees'))
    };

    try {
      if (modal.mode === "add") {
        await api.post("/projects", body);
        toast.success("Project created successfully!");
      } else {
        await api.put(`/projects/${modal.data._id}`, body);
        toast.success("Project updated successfully!");
      }
      setModal(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving project");
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'in-progress': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'not-started': return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const statsCards = [
    {
      icon: BarChart3,
      title: 'Total Projects',
      value: projects.length,
      color: 'from-blue-500 to-indigo-500',
      subtitle: 'All projects'
    },
    {
      icon: TrendingUp,
      title: 'In Progress',
      value: projects.filter(p => p.status === 'in-progress').length,
      color: 'from-yellow-500 to-orange-500',
      subtitle: 'Active now'
    },
    {
      icon: CheckCircle,
      title: 'Completed',
      value: projects.filter(p => p.status === 'completed').length,
      color: 'from-green-500 to-emerald-500',
      subtitle: 'Finished'
    },
    {
      icon: Clock,
      title: 'Not Started',
      value: projects.filter(p => p.status === 'not-started').length,
      color: 'from-gray-500 to-gray-600',
      subtitle: 'Pending'
    }
  ];

  const StatCard = ({ icon: Icon, title, value, color, subtitle }) => (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
      </div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${color} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:scale-105 transition-transform duration-300">
            {value}
          </h3>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500">{subtitle}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Project Management
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Organize, track, and manage all your projects from a centralized dashboard
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">All Projects</h2>
          <button
            onClick={() => setModal({ mode: "add" })}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span>New Project</span>
          </button>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin w-8 h-8 text-indigo-600" />
          </div>
        ) : (
          <div className="grid gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {project.name}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(project.status)}`}>
                        {project.status?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                    
                    {project.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {project.description}
                      </p>
                    )}

                    <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{project.employees?.length || 0} members</span>
                      </div>
                      {project.allottedDays && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{project.allottedDays} days</span>
                        </div>
                      )}
                      {project.startDate && (
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>Started {new Date(project.startDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setModal({ mode: "edit", data: project })}
                      className="flex items-center px-3 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors group"
                    >
                      <Edit className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" />
                      Edit
                    </button>
                    
                    <button
                      onClick={() => remove(project._id)}
                      className="flex items-center px-3 py-1.5 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors group"
                    >
                      <Trash2 className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" />
                      Delete
                    </button>
                  </div>
                </div>

                {/* Team Members */}
                {project.employees?.length > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Team Members:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.employees.map((emp) => (
                        <span
                          key={emp._id}
                          className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"
                        >
                          {emp.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {projects.length === 0 && !loading && (
              <div className="text-center py-16">
                <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  No projects yet
                </h3>
                <p className="text-gray-500">
                  Create your first project to get started
                </p>
              </div>
            )}
          </div>
        )}

        {/* Modal */}
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setModal(null)}
            />
            <form
              onSubmit={save}
              className="relative bg-white dark:bg-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl p-8 space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {modal.mode === "add" ? "Create New Project" : "Edit Project"}
                </h2>
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project Name
                  </label>
                  <input
                    required
                    name="name"
                    defaultValue={modal.data?.name}
                    placeholder="Enter project name"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    defaultValue={modal.data?.status || "not-started"}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="not-started">Not Started</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    defaultValue={modal.data?.startDate?.split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Allotted Days
                  </label>
                  <input
                    type="number"
                    name="allottedDays"
                    defaultValue={modal.data?.allottedDays}
                    placeholder="Number of days"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  defaultValue={modal.data?.description}
                  placeholder="Project description"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assign Employees
                </label>
                <select
                  name="employees"
                  multiple
                  className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  {employees.map((emp) => (
                    <option 
                      key={emp._id} 
                      value={emp._id}
                      selected={modal.data?.employees?.some(e => e._id === emp._id)}
                    >
                      {emp.name} ({emp.email})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Hold Ctrl/Cmd to select multiple employees
                </p>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-600">
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{modal.mode === "add" ? "Create Project" : "Update Project"}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

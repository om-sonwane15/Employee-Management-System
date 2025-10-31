import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import api from '../services/api';
import { CheckSquare, Loader2, Clock, AlertCircle, CheckCircle, Play } from "lucide-react";
import toast from "react-hot-toast";

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/tasks/my");
      setTasks(res.data);
    } catch (error) {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateTaskStatus = async (taskId, currentStatus) => {
    const nextStatus =
      currentStatus === "pending"
        ? "in-progress"
        : currentStatus === "in-progress"
        ? "done"
        : "pending";

    try {
      await api.put(`/tasks/${taskId}`, { status: nextStatus });
      toast.success("Status updated");
      load();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      case "in-progress":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
      case "done":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <AlertCircle className="w-4 h-4" />;
      case "in-progress":
        return <Play className="w-4 h-4" />;
      case "done":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (deadline) => {
    if (!deadline) return "";
    
    const daysUntilDeadline = dayjs(deadline).diff(dayjs(), 'days');
    
    if (daysUntilDeadline < 0) {
      return "border-l-red-500"; // Overdue
    } else if (daysUntilDeadline <= 2) {
      return "border-l-orange-500"; // Due soon
    } else if (daysUntilDeadline <= 7) {
      return "border-l-yellow-500"; // Due this week
    }
    return "border-l-green-500"; // Not urgent
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
              <CheckSquare className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              My Tasks
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Manage your assigned tasks, track progress, and stay organized
          </p>
        </div>

        {/* Tasks Content */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Assigned Tasks
              </h2>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                {tasks.length} tasks
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-16">
              <CheckSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                No tasks assigned
              </h3>
              <p className="text-gray-500 dark:text-gray-500">
                You don't have any tasks assigned at the moment
              </p>
            </div>
          ) : (
            <div className="p-6">
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task._id}
                    className={`border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border-l-4 ${getPriorityColor(task.deadline)} bg-gray-50 dark:bg-gray-700/50`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Task Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                              {task.title}
                            </h3>
                            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                              Project: {task.project?.name || "Unknown Project"}
                            </p>
                          </div>
                          
                          {/* Status Badge */}
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                            {getStatusIcon(task.status)}
                            <span className="ml-1 capitalize">{task.status.replace('-', ' ')}</span>
                          </span>
                        </div>

                        {task.description && (
                          <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 leading-relaxed">
                            {task.description}
                          </p>
                        )}

                        {/* Task Details */}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          {task.deadline && (
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>
                                Due: {dayjs(task.deadline).format("MMM DD, YYYY")}
                                {dayjs(task.deadline).isBefore(dayjs()) && (
                                  <span className="text-red-500 ml-1 font-medium">(Overdue)</span>
                                )}
                              </span>
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-1">
                            <span>Created: {dayjs(task.createdAt).format("MMM DD, YYYY")}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateTaskStatus(task._id, task.status)}
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 text-sm font-medium"
                        >
                          <CheckSquare className="w-4 h-4 mr-2" />
                          {task.status === "pending"
                            ? "Start Task"
                            : task.status === "in-progress"
                            ? "Mark Complete"
                            : "Reset Task"}
                        </button>
                      </div>
                    </div>

                    {/* Comments Section (if exists) */}
                    {task.comments && task.comments.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Recent Comments:
                        </h4>
                        <div className="space-y-2">
                          {task.comments.slice(-2).map((comment, index) => (
                            <div
                              key={index}
                              className="bg-white dark:bg-gray-800 rounded-lg p-3 text-sm"
                            >
                              <p className="text-gray-800 dark:text-gray-200">
                                {comment.text}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {dayjs(comment.createdAt).format("MMM DD, YYYY HH:mm")}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Task Summary */}
        {tasks.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {tasks.filter(t => t.status === "pending").length}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                  <Play className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {tasks.filter(t => t.status === "in-progress").length}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {tasks.filter(t => t.status === "done").length}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

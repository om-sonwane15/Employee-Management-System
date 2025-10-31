import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api  from "../services/api";
import {
  Users,
  CalendarCheck,
  FolderKanban,
  Briefcase,
  DollarSign,
  TrendingUp,
  Award,
  Clock,
  Building,
  BarChart3,
  PieChart,
  Activity,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Shield,
  Bell,
  FileText,
  Star,
  MessageSquare,
  Settings,
  UserCheck,
  Calendar,
  Plus,
  Eye,
  Edit,
  Download,
  Upload,
  Search,
  Filter,
  Zap,
  Coffee,
  Globe,
  Database,
  Server,
  Wifi,
  HardDrive,
  Cpu,
  MemoryStick,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Navigate, Link } from "react-router-dom";

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [systemStatus, setSystemStatus] = useState({
    database: 98,
    server: 95,
    api: 97,
    storage: 85
  });
  const [animatedStats, setAnimatedStats] = useState({
    employeeTotal: 0,
    presentToday: 0,
    projectTotal: 0,
    projectProgress: 0,
    payrollMonth: 0,
    avgSalary: 0,
    pendingTasks: 0,
    completedProjects: 0,
    activeNotifications: 0,
    systemHealth: 0,
    totalDepartments: 0,
    monthlyExpenses: 0
  });

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get("/admin/insights");
        setInsight(res.data);
        
        // Animate numbers
        const duration = 2000;
        const steps = 60;
        const stepTime = duration / steps;
        
        let currentStep = 0;
        const timer = setInterval(() => {
          currentStep++;
          const progress = Math.min(currentStep / steps, 1);
          
          setAnimatedStats({
            employeeTotal: Math.floor((res.data.employeeTotal || 45) * progress),
            presentToday: Math.floor((res.data.presentToday || 38) * progress),
            projectTotal: Math.floor((res.data.projectTotal || 12) * progress),
            projectProgress: Math.floor((res.data.projectProgress || 8) * progress),
            payrollMonth: Math.floor((res.data.payrollMonth || 450000) * progress),
            avgSalary: Math.floor(((res.data.payrollMonth || 450000) / (res.data.employeeTotal || 45)) * progress),
            pendingTasks: Math.floor((res.data.pendingTasks || 8) * progress),
            completedProjects: Math.floor((res.data.completedProjects || 12) * progress),
            activeNotifications: Math.floor((res.data.activeNotifications || 5) * progress),
            systemHealth: Math.floor((res.data.systemHealth || 98) * progress),
            totalDepartments: Math.floor((res.data.totalDepartments || 6) * progress),
            monthlyExpenses: Math.floor((res.data.monthlyExpenses || 125000) * progress)
          });
          
          if (progress >= 1) clearInterval(timer);
        }, stepTime);

        return () => clearInterval(timer);
      } catch (error) {
        console.error('Failed to load insights:', error);
        // Set default values for demo
        const defaultStats = {
          employeeTotal: 45,
          presentToday: 38,
          projectTotal: 12,
          projectProgress: 8,
          payrollMonth: 450000,
          avgSalary: 10000,
          pendingTasks: 8,
          completedProjects: 12,
          activeNotifications: 5,
          systemHealth: 98,
          totalDepartments: 6,
          monthlyExpenses: 125000
        };
        setAnimatedStats(defaultStats);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const StatCard = ({ icon: Icon, title, value, subtitle, color, trend, onClick }) => (
    <div 
      onClick={onClick}
      className="group relative bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden cursor-pointer"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
      
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-2xl bg-gradient-to-br ${color} group-hover:scale-110 transition-transform duration-500`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trend && (
            <div className={`flex items-center space-x-1 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span className="text-sm font-medium">{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:scale-105 transition-transform duration-300">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </h3>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-500">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );

  const QuickActionCard = ({ icon: Icon, title, description, path, color, bgColor, notification }) => (
    <Link
      to={path}
      className={`group ${bgColor} p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 block relative`}
    >
      {/* Notification Badge */}
      {notification && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium animate-pulse">
          {notification > 9 ? '9+' : notification}
        </div>
      )}
      
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {description}
          </p>
          <div className="flex items-center text-sm text-blue-600 dark:text-blue-400 font-medium group-hover:translate-x-1 transition-transform">
            <span>Open</span>
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </div>
        </div>
      </div>
    </Link>
  );

  // Primary Admin Actions - Core Management
  const primaryActions = [
    {
      icon: Users,
      title: 'Employee Management',
      description: 'Manage employee records and profiles',
      path: '/admin/employees',
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      notification: null
    },
    {
      icon: DollarSign,
      title: 'Payroll Management',
      description: 'Process salaries and manage payroll',
      path: '/admin/payroll',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      notification: animatedStats.pendingTasks > 0 ? 3 : null
    },
    {
      icon: Briefcase,
      title: 'Project Management',
      description: 'Create and oversee all projects',
      path: '/admin/projects',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      notification: null
    },
    {
      icon: CalendarCheck,
      title: 'Attendance Overview',
      description: 'Monitor employee attendance',
      path: '/admin/attendance',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      notification: null
    },
    {
      icon: FileText,
      title: 'Project Files',
      description: 'Review and manage project files',
      path: '/admin/files',
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      notification: 2
    },
    {
      icon: Star,
      title: 'Project Reviews',
      description: 'Evaluate project performance',
      path: '/admin/reviews',
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      notification: null
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Send and manage notifications',
      path: '/admin/notifications',
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      notification: animatedStats.activeNotifications
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'View detailed analytics',
      path: '/admin/analytics',
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'bg-cyan-50 dark:bg-cyan-900/20',
      notification: null
    }
  ];

  // Secondary Admin Actions - Additional Tools
  const secondaryActions = [
    {
      icon: Settings,
      title: 'System Settings',
      description: 'Configure system preferences',
      path: '/admin/settings',
      color: 'from-gray-500 to-gray-600'
    },
    {
      icon: UserCheck,
      title: 'User Permissions',
      description: 'Manage user roles and access',
      path: '/admin/permissions',
      color: 'from-teal-500 to-cyan-500'
    },
    {
      icon: Download,
      title: 'Data Export',
      description: 'Export system data',
      path: '/admin/export',
      color: 'from-emerald-500 to-green-500'
    },
    {
      icon: Upload,
      title: 'Data Import',
      description: 'Import bulk data',
      path: '/admin/import',
      color: 'from-violet-500 to-purple-500'
    },
    {
      icon: Search,
      title: 'Advanced Search',
      description: 'Search across all records',
      path: '/admin/search',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Globe,
      title: 'System Logs',
      description: 'View system activity logs',
      path: '/admin/logs',
      color: 'from-amber-500 to-orange-500'
    }
  ];

  const recentActivities = [
    {
      icon: Users,
      title: 'New employee registered',
      description: 'John Doe joined the Engineering team',
      time: '2 hours ago',
      color: 'text-blue-600'
    },
    {
      icon: Briefcase,
      title: 'Project status updated',
      description: 'Mobile App project marked as completed',
      time: '4 hours ago',
      color: 'text-green-600'
    },
    {
      icon: DollarSign,
      title: 'Payroll processed',
      description: 'Monthly payroll for 45 employees',
      time: '6 hours ago',
      color: 'text-purple-600'
    },
    {
      icon: Bell,
      title: 'System notification sent',
      description: 'Holiday announcement to all employees',
      time: '8 hours ago',
      color: 'text-orange-600'
    },
    {
      icon: FileText,
      title: 'Project file uploaded',
      description: 'Final report submitted for review',
      time: '1 day ago',
      color: 'text-indigo-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-6">
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out forwards;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse 3s ease-in-out infinite;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="animate-float">
              <Coffee className="w-8 h-8 text-orange-500" />
            </div>
            <div className="inline-flex items-center space-x-3">
              <div className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl animate-float">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
            </div>
            <div className="animate-float" style={{ animationDelay: '1s' }}>
              <Zap className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-2">
            Complete system overview and management controls at your fingertips
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>All Systems Operational</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8">
            <div className="animate-slideInUp" style={{ animationDelay: '0.1s' }}>
              <StatCard
                title="Total Employees"
                value={animatedStats.employeeTotal}
                icon={Users}
                color="from-indigo-600 to-purple-600"
                trend={12}
                subtitle="Active users"
                onClick={() => navigate('/admin/employees')}
              />
            </div>
            <div className="animate-slideInUp" style={{ animationDelay: '0.2s' }}>
              <StatCard
                title="Present Today"
                value={animatedStats.presentToday}
                icon={CalendarCheck}
                color="from-green-600 to-emerald-600"
                trend={8}
                subtitle="In office"
                onClick={() => navigate('/admin/attendance')}
              />
            </div>
            <div className="animate-slideInUp" style={{ animationDelay: '0.3s' }}>
              <StatCard
                title="Active Projects"
                value={animatedStats.projectProgress}
                icon={FolderKanban}
                color="from-yellow-600 to-orange-600"
                trend={15}
                subtitle="In progress"
                onClick={() => navigate('/admin/projects')}
              />
            </div>
            <div className="animate-slideInUp" style={{ animationDelay: '0.4s' }}>
              <StatCard
                title="Monthly Payroll"
                value={`₹${animatedStats.payrollMonth.toLocaleString()}`}
                icon={DollarSign}
                color="from-rose-600 to-pink-600"
                trend={3}
                subtitle="This month"
                onClick={() => navigate('/admin/payroll')}
              />
            </div>
            <div className="animate-slideInUp" style={{ animationDelay: '0.5s' }}>
              <StatCard
                title="Departments"
                value={animatedStats.totalDepartments}
                icon={Building}
                color="from-teal-600 to-cyan-600"
                trend={2}
                subtitle="Active departments"
                onClick={() => navigate('/admin/departments')}
              />
            </div>
            <div className="animate-slideInUp" style={{ animationDelay: '0.6s' }}>
              <StatCard
                title="System Health"
                value={`${animatedStats.systemHealth}%`}
                icon={Activity}
                color="from-emerald-600 to-green-600"
                trend={1}
                subtitle="All systems"
                onClick={() => navigate('/admin/system')}
              />
            </div>
          </div>
        )}

        {/* Primary Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-8 animate-slideInUp">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl animate-pulse-slow">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Quick Access - Admin Controls
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Access all your administrative tools and system management features
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>All systems operational</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {primaryActions.map((action, index) => (
              <div
                key={index}
                className="animate-slideInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <QuickActionCard {...action} />
              </div>
            ))}
          </div>
        </div>

        {/* Secondary Actions & Recent Activity Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Secondary Actions */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 animate-slideInUp">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Additional Tools
              </h3>
            </div>

            <div className="space-y-3">
              {secondaryActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.path}
                  className="group bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-300 hover:-translate-y-1 block"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${action.color} group-hover:scale-110 transition-transform duration-300`}>
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {action.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{action.description}</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 animate-slideInUp">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  Recent System Activity
                </h3>
              </div>
              <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
                View All Activities
              </button>
            </div>

            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 cursor-pointer group"
                >
                  <div className={`p-2 rounded-lg bg-white dark:bg-gray-800 ${activity.color} group-hover:scale-110 transition-transform`}>
                    <activity.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Status & Health */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 animate-slideInUp">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                  System Status: All Systems Operational
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last updated: {currentTime.toLocaleTimeString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link
                to="/admin/system"
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 group text-sm"
              >
                <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>View Details</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* System Health Metrics */}
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div className="flex items-center justify-center mb-2">
                <Database className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">{systemStatus.database}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Database</div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                <div className="bg-green-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${systemStatus.database}%` }}></div>
              </div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <div className="flex items-center justify-center mb-2">
                <Server className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">{systemStatus.server}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Server</div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                <div className="bg-blue-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${systemStatus.server}%` }}></div>
              </div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <div className="flex items-center justify-center mb-2">
                <Wifi className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-600">{systemStatus.api}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">API</div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                <div className="bg-purple-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${systemStatus.api}%` }}></div>
              </div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
              <div className="flex items-center justify-center mb-2">
                <HardDrive className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-600">{systemStatus.storage}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Storage</div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                <div className="bg-orange-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${systemStatus.storage}%` }}></div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle2 className="w-4 h-4" />
              <span>All Services Running</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-600">
              <RefreshCw className="w-4 h-4" />
              <span>Auto-Updated</span>
            </div>
            <div className="flex items-center space-x-2 text-purple-600">
              <Shield className="w-4 h-4" />
              <span>Secure & Protected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

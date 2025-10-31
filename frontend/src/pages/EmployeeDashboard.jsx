import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MotivationalQuote from '../components/MotivationalQuote';
import { 
  Calendar, 
  Users, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Award,
  Target,
  Briefcase,
  DollarSign,
  MessageSquare,
  Bell,
  Video,
  FileText,
  BarChart3,
  Settings,
  User,
  ArrowRight,
  Plus,
  Activity,
  Folder,
  Upload,
  Download,
  Star,
  Coffee,
  Zap,
  Calendar as CalendarIcon,
  MapPin,
  Phone,
  Mail,
  Building,
  Home,
  PieChart,
  Clipboard,
  Shield,
  BookOpen,
  Globe,
  Camera,
  Heart,
  Gift,
  Lightbulb,
  Headphones,
  Sparkles,
  Eye,
  Edit,
  Save,
  Search,
  Filter,
  Bookmark,
  Navigation,
  Layers
} from 'lucide-react';
import { Navigate } from 'react-router-dom';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    tasksCompleted: 12,
    hoursLogged: 38.5,
    activeProjects: 3,
    goalProgress: 78,
    attendanceRate: 95,
    pendingTasks: 5,
    meetingsToday: 2,
    unreadMessages: 8,
    projectsCompleted: 8,
    performanceScore: 92
  });

  // Redirect if not employee
  if (!user || user.role !== 'employee') {
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
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good Morning');
    } else if (hour < 17) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  }, []);

  const quickStats = [
    {
      icon: CheckCircle,
      title: 'Tasks Completed',
      value: stats.tasksCompleted,
      subtitle: 'This week',
      color: 'from-green-500 to-emerald-500',
      trend: '+12%',
      action: () => navigate('/tasks')
    },
    {
      icon: Clock,
      title: 'Hours Logged',
      value: `${stats.hoursLogged}h`,
      subtitle: 'This week',
      color: 'from-blue-500 to-indigo-500',
      trend: '+5%',
      action: () => navigate('/attendance')
    },
    {
      icon: Award,
      title: 'Active Projects',
      value: stats.activeProjects,
      subtitle: 'Assigned to you',
      color: 'from-purple-500 to-pink-500',
      trend: '+1',
      action: () => navigate('/projects')
    },
    {
      icon: Target,
      title: 'Goal Progress',
      value: `${stats.goalProgress}%`,
      subtitle: 'Monthly target',
      color: 'from-orange-500 to-red-500',
      trend: '+8%',
      action: () => navigate('/performance')
    },
    {
      icon: Calendar,
      title: 'Attendance Rate',
      value: `${stats.attendanceRate}%`,
      subtitle: 'This month',
      color: 'from-cyan-500 to-blue-500',
      trend: '+2%',
      action: () => navigate('/attendance')
    },
    {
      icon: Star,
      title: 'Performance Score',
      value: `${stats.performanceScore}%`,
      subtitle: 'Overall rating',
      color: 'from-yellow-500 to-orange-500',
      trend: '+5%',
      action: () => navigate('/performance')
    }
  ];

  // Primary Quick Access - Main Employee Functions
  const primaryActions = [
    {
      icon: Calendar,
      title: 'Attendance',
      description: 'Mark attendance & view records',
      path: '/attendance',
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      notification: null
    },
    {
      icon: DollarSign,
      title: 'My Payroll',
      description: 'View salary & download slips',
      path: '/my-payroll',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      notification: null
    },
    {
      icon: Briefcase,
      title: 'My Tasks',
      description: 'View & update task status',
      path: '/tasks',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      notification: stats.pendingTasks > 0 ? stats.pendingTasks : null
    },
    {
      icon: Video,
      title: 'Meetings',
      description: 'Schedule & join meetings',
      path: '/meetings',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      notification: stats.meetingsToday > 0 ? stats.meetingsToday : null
    },
    {
      icon: MessageSquare,
      title: 'Team Chat',
      description: 'Connect with colleagues',
      path: '/chat',
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'bg-cyan-50 dark:bg-cyan-900/20',
      notification: stats.unreadMessages > 0 ? stats.unreadMessages : null
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'View important updates',
      path: '/notifications',
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      notification: 3
    },
    {
      icon: FileText,
      title: 'Project Files',
      description: 'Access project documents',
      path: '/project-files',
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      notification: null
    },
    {
      icon: BarChart3,
      title: 'Performance',
      description: 'View performance metrics',
      path: '/performance',
      color: 'from-rose-500 to-pink-500',
      bgColor: 'bg-rose-50 dark:bg-rose-900/20',
      notification: null
    }
  ];

  // Secondary Quick Access - Additional Functions
  const secondaryActions = [
    {
      icon: User,
      title: 'My Profile',
      description: 'Update personal information',
      path: '/profile',
      color: 'from-gray-500 to-gray-600'
    },
    {
      icon: Settings,
      title: 'Settings',
      description: 'Customize your preferences',
      path: '/settings',
      color: 'from-slate-500 to-slate-600'
    },
    {
      icon: Folder,
      title: 'My Documents',
      description: 'Personal document storage',
      path: '/documents',
      color: 'from-amber-500 to-orange-500'
    },
    {
      icon: PieChart,
      title: 'Analytics',
      description: 'Personal work analytics',
      path: '/analytics',
      color: 'from-teal-500 to-cyan-500'
    },
    {
      icon: BookOpen,
      title: 'Learning',
      description: 'Training & development',
      path: '/learning',
      color: 'from-violet-500 to-purple-500'
    },
    {
      icon: Headphones,
      title: 'Support',
      description: 'Get help & assistance',
      path: '/support',
      color: 'from-emerald-500 to-green-500'
    }
  ];

  // Utility Actions
  const utilityActions = [
    { icon: Upload, title: 'Upload Files', path: '/upload', color: 'text-blue-600' },
    { icon: Download, title: 'Downloads', path: '/downloads', color: 'text-green-600' },
    { icon: Star, title: 'Favorites', path: '/favorites', color: 'text-yellow-600' },
    { icon: Clipboard, title: 'Reports', path: '/reports', color: 'text-purple-600' },
    { icon: Camera, title: 'Gallery', path: '/gallery', color: 'text-pink-600' },
    { icon: Globe, title: 'Resources', path: '/resources', color: 'text-indigo-600' },
    { icon: Search, title: 'Search', path: '/search', color: 'text-gray-600' },
    { icon: Bookmark, title: 'Bookmarks', path: '/bookmarks', color: 'text-red-600' }
  ];

  const recentActivities = [
    {
      icon: CheckCircle,
      title: 'Task completed',
      description: 'Website redesign mockups submitted',
      time: '2 hours ago',
      color: 'text-green-600'
    },
    {
      icon: MessageSquare,
      title: 'New message',
      description: 'Team meeting scheduled for tomorrow',
      time: '4 hours ago',
      color: 'text-blue-600'
    },
    {
      icon: Upload,
      title: 'File uploaded',
      description: 'Project documentation.pdf uploaded',
      time: '6 hours ago',
      color: 'text-purple-600'
    },
    {
      icon: Star,
      title: 'Achievement unlocked',
      description: 'Completed 50 tasks milestone',
      time: '1 day ago',
      color: 'text-yellow-600'
    },
    {
      icon: Video,
      title: 'Meeting attended',
      description: 'Weekly standup meeting completed',
      time: '2 days ago',
      color: 'text-orange-600'
    },
    {
      icon: Award,
      title: 'Project milestone',
      description: 'Mobile app project 75% complete',
      time: '3 days ago',
      color: 'text-indigo-600'
    }
  ];

  const StatCard = ({ icon: Icon, title, value, subtitle, color, trend, action }) => (
    <div 
      onClick={action}
      className="group relative bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden cursor-pointer"
    >
      {/* Animated background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
      
      {/* Floating sparkles */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-2xl bg-gradient-to-br ${color} group-hover:scale-110 transition-transform duration-500`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trend && (
            <span className={`text-sm font-medium px-2 py-1 rounded-full ${
              trend.startsWith('+') 
                ? 'text-green-600 bg-green-100 dark:bg-green-900/20' 
                : trend.startsWith('-')
                ? 'text-red-600 bg-red-100 dark:bg-red-900/20'
                : 'text-gray-600 bg-gray-100 dark:bg-gray-900/20'
            }`}>
              {trend}
            </span>
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
            <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </div>
      </div>
    </Link>
  );

  const SecondaryActionCard = ({ icon: Icon, title, description, path, color }) => (
    <Link
      to={path}
      className="group bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300 hover:-translate-y-1 block"
    >
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg bg-gradient-to-br ${color} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {title}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-6">
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
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
        
        .animate-bounceIn {
          animation: bounceIn 0.8s ease-out forwards;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse 3s ease-in-out infinite;
        }
      `}</style>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="text-center mb-8 animate-fadeIn">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="animate-float">
              <Coffee className="w-8 h-8 text-orange-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {greeting}, {user?.name?.split(' ')[0] || 'Team Member'}!
            </h1>
            <div className="animate-float" style={{ animationDelay: '1s' }}>
              <Zap className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
            Ready to make today productive? Let's achieve your goals! 🚀
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-4 h-4" />
              <span>{currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>{user?.department || 'Department'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>You're online</span>
            </div>
          </div>
        </div>

        {/* Motivational Quote - Prominent Position */}
        <div className="animate-fadeIn">
          <MotivationalQuote />
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {quickStats.map((stat, index) => (
            <div
              key={index}
              className="animate-slideInUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <StatCard {...stat} />
            </div>
          ))}
        </div>

        {/* Primary Quick Actions Section */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 animate-slideInUp">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl animate-pulse-slow">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Quick Access - Employee Tools
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Access all your essential work tools and information in one place
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>All systems available</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {primaryActions.map((action, index) => (
              <div
                key={index}
                className="animate-bounceIn"
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
                More Tools
              </h3>
            </div>

            <div className="space-y-3">
              {secondaryActions.map((action, index) => (
                <div
                  key={index}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <SecondaryActionCard {...action} />
                </div>
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
                  Recent Activity
                </h3>
              </div>
              <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
                View All
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
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Utility Actions Grid */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 animate-slideInUp">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Quick Utilities
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {utilityActions.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="flex flex-col items-center space-y-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 group"
              >
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg group-hover:scale-110 transition-transform shadow-sm">
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
                  {item.title}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Profile Quick Info Footer */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 animate-slideInUp">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {user?.name || 'User Name'}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                  {user?.role} • {user?.department}
                </p>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Mail className="w-3 h-3" />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Phone className="w-3 h-3" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link
                to="/profile"
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 group text-sm"
              >
                <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Edit Profile</span>
              </Link>
              <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;

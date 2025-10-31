import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { profilePhotoAPI } from "../services/api";
import { 
  Menu, 
  X, 
  LogOut, 
  User, 
  Settings, 
  Bell, 
  Sun, 
  Moon, 
  Calendar, 
  DollarSign, 
  BarChart3, 
  Users, 
  Briefcase, 
  MessageSquare, 
  FileText, 
  Star,
  Building,
  Video,
  ChevronDown,
  Home,
  Shield,
  Clock,
  TrendingUp,
  Award,
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  Globe,
  Database,
  Activity,
  Zap,
  Coffee
} from "lucide-react";

const Navbar = () => {
  const { user, logout, isAdmin, isEmployee } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [photoUrl, setPhotoUrl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const [employeeDropdownOpen, setEmployeeDropdownOpen] = useState(false);
  const [notificationCount] = useState(5);

  // Fetch profile image
  useEffect(() => {
    let isMounted = true;
    const fetchPhoto = async () => {
      if (!user) {
        setPhotoUrl(null);
        return;
      }
      try {
        const res = await profilePhotoAPI.downloadPhoto();
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        if (isMounted) setPhotoUrl(url);
      } catch {
        setPhotoUrl(null);
      }
    };
    fetchPhoto();
    return () => { isMounted = false; };
  }, [user]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setProfileDropdownOpen(false);
        setAdminDropdownOpen(false);
        setEmployeeDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const NavLink = ({ to, children, icon: Icon, onClick, badge }) => (
    <Link
      to={to}
      onClick={onClick}
      className={`relative flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group ${
        isActive(to)
          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-105'
      }`}
    >
      {Icon && <Icon className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />}
      <span>{children}</span>
      {badge && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium animate-pulse">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </Link>
  );

  const DropdownItem = ({ to, children, icon: Icon, onClick, badge }) => (
    <Link
      to={to}
      onClick={onClick}
      className="relative flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 rounded-lg mx-2 group"
    >
      {Icon && (
        <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
          <Icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
        </div>
      )}
      <span className="flex-1">{children}</span>
      {badge && (
        <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </Link>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Building className="w-7 h-7 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  EMS Pro
                </span>
                <div className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                  Employee Management
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {user ? (
              <>
                {/* Role-based Navigation */}
                {isEmployee && (
                  <>
                    <NavLink to="/employee/dashboard" icon={Home}>Dashboard</NavLink>
                    <NavLink to="/attendance" icon={Calendar}>Attendance</NavLink>
                    <NavLink to="/my-payroll" icon={DollarSign}>Payroll</NavLink>
                    <NavLink to="/tasks" icon={Briefcase} badge={3}>Tasks</NavLink>
                    <NavLink to="/meetings" icon={Video} badge={1}>Meetings</NavLink>
                    <NavLink to="/notifications" icon={Bell} badge={notificationCount > 0 ? notificationCount : null}>
                      Notifications
                    </NavLink>
                  </>
                )}

                {isAdmin && (
                  <>
                    <NavLink to="/admin/dashboard" icon={BarChart3}>Dashboard</NavLink>
                    
                    {/* Admin Quick Access Dropdown */}
                    <div className="relative dropdown-container">
                      <button
                        onClick={() => setAdminDropdownOpen(!adminDropdownOpen)}
                        className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group ${
                          location.pathname.startsWith('/admin')
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 hover:text-purple-600 dark:hover:text-purple-400'
                        }`}
                      >
                        <Shield className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                        <span>Admin Panel</span>
                        <ChevronDown className={`w-4 h-4 transform transition-transform duration-300 ${adminDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {adminDropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 py-3 z-50">
                          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Core Management
                            </p>
                          </div>
                          
                          <DropdownItem 
                            to="/admin/employees" 
                            icon={Users}
                            onClick={() => setAdminDropdownOpen(false)}
                          >
                            Employee Management
                          </DropdownItem>
                          <DropdownItem 
                            to="/admin/payroll" 
                            icon={DollarSign}
                            onClick={() => setAdminDropdownOpen(false)}
                            badge={3}
                          >
                            Payroll Management
                          </DropdownItem>
                          <DropdownItem 
                            to="/admin/projects" 
                            icon={Briefcase}
                            onClick={() => setAdminDropdownOpen(false)}
                          >
                            Project Management
                          </DropdownItem>
                          <DropdownItem 
                            to="/admin/attendance" 
                            icon={Calendar}
                            onClick={() => setAdminDropdownOpen(false)}
                          >
                            Attendance Overview
                          </DropdownItem>
                          
                          <div className="px-4 py-2 border-t border-b border-gray-200 dark:border-gray-700 mt-2">
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Analysis & Reports
                            </p>
                          </div>
                          
                          <DropdownItem 
                            to="/admin/files" 
                            icon={FileText}
                            onClick={() => setAdminDropdownOpen(false)}
                            badge={2}
                          >
                            Project Files
                          </DropdownItem>
                          <DropdownItem 
                            to="/admin/reviews" 
                            icon={Star}
                            onClick={() => setAdminDropdownOpen(false)}
                          >
                            Project Reviews
                          </DropdownItem>
                          <DropdownItem 
                            to="/admin/analytics" 
                            icon={TrendingUp}
                            onClick={() => setAdminDropdownOpen(false)}
                          >
                            Analytics & Reports
                          </DropdownItem>
                          <DropdownItem 
                            to="/admin/notifications" 
                            icon={Bell}
                            onClick={() => setAdminDropdownOpen(false)}
                            badge={notificationCount}
                          >
                            Notifications
                          </DropdownItem>
                          
                          <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              System Tools
                            </p>
                          </div>
                          
                          <DropdownItem 
                            to="/admin/settings" 
                            icon={Settings}
                            onClick={() => setAdminDropdownOpen(false)}
                          >
                            System Settings
                          </DropdownItem>
                          <DropdownItem 
                            to="/admin/logs" 
                            icon={Activity}
                            onClick={() => setAdminDropdownOpen(false)}
                          >
                            System Logs
                          </DropdownItem>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <NavLink to="/login">Login</NavLink>
                <Link
                  to="/register"
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-sm font-medium"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-300 group"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              ) : (
                <Sun className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300 text-yellow-400" />
              )}
            </button>

            {user && (
              <>
                {/* Quick Notifications Bell */}
                <Link
                  to={isAdmin ? "/admin/notifications" : "/notifications"}
                  className={`relative p-2.5 rounded-xl transition-all duration-300 group ${
                    isActive('/notifications') || isActive('/admin/notifications')
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20'
                  }`}
                  title="View All Notifications"
                >
                  <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-medium animate-pulse">
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                  )}
                </Link>

                {/* Profile Dropdown */}
                <div className="relative dropdown-container">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 group"
                  >
                    <img
                      src={photoUrl || "/default-avatar.png"}
                      alt="Profile"
                      className="w-9 h-9 rounded-full border-2 border-gray-300 dark:border-gray-600 object-cover group-hover:border-blue-400 transition-all duration-300"
                      onError={(e) => { e.target.src = "/default-avatar.png"; }}
                    />
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name?.split(' ')[0] || "User"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {user.role}
                      </p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-600 dark:text-gray-300 transform transition-transform duration-300 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 py-3 z-50">
                      {/* User Info */}
                      <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                          <img
                            src={photoUrl || "/default-avatar.png"}
                            alt="Profile"
                            className="w-12 h-12 rounded-full object-cover"
                            onError={(e) => { e.target.src = "/default-avatar.png"; }}
                          />
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              {user.name || "User Name"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {user.email}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                user.role === 'admin' 
                                  ? 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400'
                                  : 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400'
                              }`}>
                                {user.role === 'admin' ? '👑 Administrator' : '👤 Employee'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <DropdownItem 
                        to="/profile" 
                        icon={User}
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        My Profile
                      </DropdownItem>
                      
                      {isEmployee && (
                        <>
                          <DropdownItem 
                            to="/employee/dashboard" 
                            icon={Home}
                            onClick={() => setProfileDropdownOpen(false)}
                          >
                            Employee Dashboard
                          </DropdownItem>
                          <DropdownItem 
                            to="/tasks" 
                            icon={Briefcase}
                            onClick={() => setProfileDropdownOpen(false)}
                            badge={3}
                          >
                            My Tasks
                          </DropdownItem>
                        </>
                      )}
                      
                      {isAdmin && (
                        <DropdownItem 
                          to="/admin/dashboard" 
                          icon={Shield}
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          Admin Dashboard
                        </DropdownItem>
                      )}
                      
                      <DropdownItem 
                        to="/settings" 
                        icon={Settings}
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        Settings
                      </DropdownItem>

                      <div className="border-t border-gray-200 dark:border-gray-600 my-2"></div>

                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 rounded-lg mx-2 group"
                      >
                        <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-lg group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                          <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-300 group"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              ) : (
                <Menu className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 py-4 space-y-2">
            {user ? (
              <>
                {/* Mobile User Info */}
                <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl mx-2 mb-4">
                  <img
                    src={photoUrl || "/default-avatar.png"}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => { e.target.src = "/default-avatar.png"; }}
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {user.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {user.role} • {user.department}
                    </p>
                  </div>
                </div>

                {/* Role-based Mobile Navigation */}
                {isEmployee && (
                  <>
                    <NavLink 
                      to="/employee/dashboard" 
                      icon={Home}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </NavLink>
                    <NavLink 
                      to="/attendance" 
                      icon={Calendar}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Attendance
                    </NavLink>
                    <NavLink 
                      to="/my-payroll" 
                      icon={DollarSign}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Payroll
                    </NavLink>
                    <NavLink 
                      to="/tasks" 
                      icon={Briefcase}
                      onClick={() => setMobileMenuOpen(false)}
                      badge={3}
                    >
                      Tasks
                    </NavLink>
                    <NavLink 
                      to="/meetings" 
                      icon={Video}
                      onClick={() => setMobileMenuOpen(false)}
                      badge={1}
                    >
                      Meetings
                    </NavLink>
                    <NavLink 
                      to="/notifications" 
                      icon={Bell}
                      onClick={() => setMobileMenuOpen(false)}
                      badge={notificationCount}
                    >
                      Notifications
                    </NavLink>
                  </>
                )}

                {isAdmin && (
                  <>
                    <div className="border-t border-gray-200 dark:border-gray-600 my-3 pt-3">
                      <div className="flex items-center space-x-2 px-4 py-2">
                        <Shield className="w-4 h-4 text-purple-600" />
                        <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                          Admin Panel
                        </p>
                      </div>
                    </div>
                    <NavLink 
                      to="/admin/dashboard" 
                      icon={BarChart3}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Dashboard
                    </NavLink>
                    <NavLink 
                      to="/admin/employees" 
                      icon={Users}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Employee Management
                    </NavLink>
                    <NavLink 
                      to="/admin/payroll" 
                      icon={DollarSign}
                      onClick={() => setMobileMenuOpen(false)}
                      badge={3}
                    >
                      Payroll Management
                    </NavLink>
                    <NavLink 
                      to="/admin/projects" 
                      icon={Briefcase}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Project Management
                    </NavLink>
                    <NavLink 
                      to="/admin/files" 
                      icon={FileText}
                      onClick={() => setMobileMenuOpen(false)}
                      badge={2}
                    >
                      Project Files
                    </NavLink>
                    <NavLink 
                      to="/admin/reviews" 
                      icon={Star}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Project Reviews
                    </NavLink>
                    <NavLink 
                      to="/admin/notifications" 
                      icon={Bell}
                      onClick={() => setMobileMenuOpen(false)}
                      badge={notificationCount}
                    >
                      Notifications
                    </NavLink>
                    <NavLink 
                      to="/admin/analytics" 
                      icon={TrendingUp}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Analytics
                    </NavLink>
                  </>
                )}

                <div className="border-t border-gray-200 dark:border-gray-600 my-3 pt-3">
                  <NavLink 
                    to="/profile" 
                    icon={User}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </NavLink>
                  <NavLink 
                    to="/settings" 
                    icon={Settings}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Settings
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300 group"
                  >
                    <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-lg">
                      <LogOut className="w-4 h-4" />
                    </div>
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <NavLink 
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </NavLink>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block mx-2 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:shadow-lg transition-all text-center"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

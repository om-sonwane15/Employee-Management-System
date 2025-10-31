import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import HomePage from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Common Protected Pages
import Profile from './pages/Profile';
import Settings from './pages/Settings';

// Employee-Only Pages
import EmployeeDashboard from './pages/EmployeeDashboard';
import Attendance from './pages/Attendance';
import MyPayroll from './pages/MyPayroll';
import MyTasks from './pages/MyTasks';
import Meetings from './pages/Meetings';
import ProjectFiles from './pages/ProjectFiles';

// Admin-Only Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminPayroll from './pages/AdminPayroll';
import AdminProjects from './pages/AdminProjects';
import AdminFiles from './pages/AdminFiles';
import NotificationPage from './pages/NotificationPage';
import AdminReviews from './pages/AdminReviews';

// Import useAuth hook
import { useAuth } from './context/AuthContext';

// Conditional Navbar Component
const ConditionalNavbar = () => {
  const location = useLocation(); // Now properly imported
  const hideNavbarRoutes = ['/', '/login', '/register'];
  
  // Hide navbar on specific routes
  if (hideNavbarRoutes.includes(location.pathname)) {
    return null;
  }
  
  return <Navbar />;
};

// Role-based Dashboard Redirect Component
const DashboardRedirect = () => {
  return (
    <ProtectedRoute>
      <DashboardRouter />
    </ProtectedRoute>
  );
};

const DashboardRouter = () => {
  const { user } = useAuth();
  
  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  } else if (user?.role === 'employee') {
    return <Navigate to="/employee/dashboard" replace />;
  }
  
  return <Navigate to="/" replace />;
};

// 404 Page
const NotFound = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-400 mb-4">404</h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">Page not found</p>
      <a href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        Go Home
      </a>
    </div>
  </div>
);

// Main App Layout Component
const AppLayout = () => {
  const location = useLocation();
  const hideNavbarRoutes = ['/', '/login', '/register'];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <ConditionalNavbar />
      
      <main className={shouldHideNavbar ? '' : 'pt-16'}>
        <Routes>
          {/* ========== PUBLIC ROUTES ========== */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* ========== ROLE-BASED DASHBOARD REDIRECT ========== */}
          <Route path="/dashboard" element={<DashboardRedirect />} />
          
          {/* ========== COMMON PROTECTED ROUTES ========== */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } 
          />

          {/* ========== EMPLOYEE-ONLY ROUTES ========== */}
          <Route 
            path="/employee/dashboard" 
            element={
              <ProtectedRoute requireRole="employee">
                <EmployeeDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/attendance" 
            element={
              <ProtectedRoute requireRole="employee">
                <Attendance />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/my-payroll" 
            element={
              <ProtectedRoute requireRole="employee">
                <MyPayroll />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/tasks" 
            element={
              <ProtectedRoute requireRole="employee">
                <MyTasks />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/meetings" 
            element={
              <ProtectedRoute requireRole="employee">
                <Meetings />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/project/:projectId/files" 
            element={
              <ProtectedRoute requireRole="employee">
                <ProjectFiles />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/project-files" 
            element={
              <ProtectedRoute requireRole="employee">
                <ProjectFiles />
              </ProtectedRoute>
            } 
          />

          {/* Employee Notifications */}
          <Route 
            path="/notifications" 
            element={
              <ProtectedRoute requireRole="employee">
                <NotificationPage />
              </ProtectedRoute>
            } 
          />

          {/* ========== ADMIN-ONLY ROUTES ========== */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute requireRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/payroll" 
            element={
              <ProtectedRoute requireRole="admin">
                <AdminPayroll />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/projects" 
            element={
              <ProtectedRoute requireRole="admin">
                <AdminProjects />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/files" 
            element={
              <ProtectedRoute requireRole="admin">
                <AdminFiles />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Notifications */}
          <Route 
            path="/admin/notifications" 
            element={
              <ProtectedRoute requireRole="admin">
                <NotificationPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/reviews" 
            element={
              <ProtectedRoute requireRole="admin">
                <AdminReviews />
              </ProtectedRoute>
            } 
          />

          {/* ========== LEGACY REDIRECTS ========== */}
          <Route 
            path="/payroll" 
            element={<Navigate to="/my-payroll" replace />} 
          />

          {/* ========== 404 ROUTE ========== */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '12px',
            padding: '16px',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
          loading: {
            iconTheme: {
              primary: '#3b82f6',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppLayout />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database,
  Mail,
  Globe,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    // General
    companyName: 'Your Company',
    companyEmail: 'admin@company.com',
    timezone: 'UTC-5',
    language: 'en',
    
    // Notifications
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    
    // Security
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordPolicy: 'medium',
    
    // Appearance
    theme: 'light',
    primaryColor: 'blue',
    compactView: false
  });

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'data', label: 'Data & Privacy', icon: Database }
  ];

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-600 via-blue-600 to-purple-600 px-8 py-12 relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            
            <div className="relative z-10 flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <SettingsIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
                <p className="text-gray-100 text-lg">Customize your Employee Management System</p>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Content */}
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
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">General Settings</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={settings.companyName}
                        onChange={(e) => handleSettingChange('companyName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Company Email
                      </label>
                      <input
                        type="email"
                        value={settings.companyEmail}
                        onChange={(e) => handleSettingChange('companyEmail', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Timezone
                      </label>
                      <select
                        value={settings.timezone}
                        onChange={(e) => handleSettingChange('timezone', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="UTC-5">UTC-5 (Eastern)</option>
                        <option value="UTC-6">UTC-6 (Central)</option>
                        <option value="UTC-7">UTC-7 (Mountain)</option>
                        <option value="UTC-8">UTC-8 (Pacific)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Language
                      </label>
                      <select
                        value={settings.language}
                        onChange={(e) => handleSettingChange('language', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl">
                      <div className="flex items-center space-x-4">
                        <Mail className="w-6 h-6 text-blue-600" />
                        <div>
                          <h3 className="font-semibold text-gray-900">Email Notifications</h3>
                          <p className="text-gray-600">Receive important updates via email</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.emailNotifications}
                          onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl">
                      <div className="flex items-center space-x-4">
                        <Bell className="w-6 h-6 text-green-600" />
                        <div>
                          <h3 className="font-semibold text-gray-900">Push Notifications</h3>
                          <p className="text-gray-600">Get instant notifications in your browser</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.pushNotifications}
                          onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl">
                      <div className="flex items-center space-x-4">
                        <Globe className="w-6 h-6 text-purple-600" />
                        <div>
                          <h3 className="font-semibold text-gray-900">Weekly Reports</h3>
                          <p className="text-gray-600">Receive weekly analytics and summaries</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.weeklyReports}
                          onChange={(e) => handleSettingChange('weeklyReports', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-2xl">
                      <div className="flex items-center space-x-4 mb-4">
                        <Shield className="w-6 h-6 text-yellow-600" />
                        <div>
                          <h3 className="font-semibold text-yellow-900">Two-Factor Authentication</h3>
                          <p className="text-yellow-700">Add an extra layer of security to your account</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-yellow-800">
                          {settings.twoFactorAuth ? 'Enabled' : 'Disabled'}
                        </span>
                        <button
                          onClick={() => handleSettingChange('twoFactorAuth', !settings.twoFactorAuth)}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            settings.twoFactorAuth
                              ? 'bg-red-600 text-white hover:bg-red-700'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {settings.twoFactorAuth ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Session Timeout (minutes)
                        </label>
                        <input
                          type="number"
                          value={settings.sessionTimeout}
                          onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Password Policy
                        </label>
                        <select
                          value={settings.passwordPolicy}
                          onChange={(e) => handleSettingChange('passwordPolicy', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="low">Low - 6 characters minimum</option>
                          <option value="medium">Medium - 8 characters with mixed case</option>
                          <option value="high">High - 12 characters with symbols</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Appearance Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Theme</label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => handleSettingChange('theme', 'light')}
                          className={`p-4 border-2 rounded-xl transition-all duration-300 ${
                            settings.theme === 'light'
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="w-full h-20 bg-white rounded-lg mb-3 border border-gray-200"></div>
                          <p className="font-medium">Light Theme</p>
                        </button>
                        
                        <button
                          onClick={() => handleSettingChange('theme', 'dark')}
                          className={`p-4 border-2 rounded-xl transition-all duration-300 ${
                            settings.theme === 'dark'
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="w-full h-20 bg-gray-800 rounded-lg mb-3"></div>
                          <p className="font-medium">Dark Theme</p>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Primary Color</label>
                      <div className="flex space-x-3">
                        {['blue', 'green', 'purple', 'red', 'orange'].map((color) => (
                          <button
                            key={color}
                            onClick={() => handleSettingChange('primaryColor', color)}
                            className={`w-12 h-12 rounded-full border-4 transition-all duration-300 ${
                              settings.primaryColor === color
                                ? 'border-gray-400 scale-110'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            style={{ backgroundColor: `var(--color-${color}-500)` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Data & Privacy */}
            {activeTab === 'data' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Data & Privacy</h2>
                  
                  <div className="space-y-6">
                    <div className="p-6 bg-blue-50 border border-blue-200 rounded-2xl">
                      <h3 className="font-semibold text-blue-900 mb-2">Data Export</h3>
                      <p className="text-blue-700 mb-4">
                        Download all your company data in a portable format
                      </p>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Request Data Export
                      </button>
                    </div>

                    <div className="p-6 bg-red-50 border border-red-200 rounded-2xl">
                      <h3 className="font-semibold text-red-900 mb-2">Delete Account</h3>
                      <p className="text-red-700 mb-4">
                        Permanently delete your account and all associated data
                      </p>
                      <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end pt-8 border-t border-gray-200">
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

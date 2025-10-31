import React, { useState } from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Download, 
  Calendar,
  Users,
  DollarSign,
  Clock,
  Award,
  Building,
  FileText,
  Filter
} from 'lucide-react';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateRange, setDateRange] = useState('month');

  const reportTypes = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'attendance', label: 'Attendance', icon: Clock },
    { id: 'payroll', label: 'Payroll', icon: DollarSign },
    { id: 'performance', label: 'Performance', icon: Award },
    { id: 'departments', label: 'Departments', icon: Building }
  ];

  const ReportCard = ({ title, value, change, icon: Icon, color = 'blue' }) => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${
              change.startsWith('+') ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>{change} from last period</span>
            </div>
          )}
        </div>
        <div className={`p-3 bg-${color}-100 rounded-xl`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 px-8 py-12 relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">Reports & Analytics</h1>
                  <p className="text-purple-100 text-lg">Insights into your organization's performance</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Report Navigation */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-wrap gap-2">
              {reportTypes.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setSelectedReport(id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    selectedReport === id
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
            
            <div className="flex items-center space-x-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
              
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
              
              <button className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Overview Report */}
        {selectedReport === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ReportCard
                title="Total Employees"
                value="156"
                change="+12"
                icon={Users}
                color="blue"
              />
              <ReportCard
                title="Active Projects"
                value="24"
                change="+3"
                icon={FileText}
                color="green"
              />
              <ReportCard
                title="Avg Attendance"
                value="94.2%"
                change="+2.1%"
                icon={Clock}
                color="orange"
              />
              <ReportCard
                title="Monthly Payroll"
                value="$485K"
                change="+8.5%"
                icon={DollarSign}
                color="purple"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Employee Growth</h3>
                <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4" />
                    <p>Chart visualization would go here</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Department Distribution</h3>
                <div className="h-64 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <PieChart className="w-16 h-16 mx-auto mb-4" />
                    <p>Chart visualization would go here</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { action: 'New employee onboarded', department: 'IT', time: '2 hours ago' },
                  { action: 'Payroll processed', department: 'HR', time: '1 day ago' },
                  { action: 'Performance review completed', department: 'Marketing', time: '2 days ago' },
                  { action: 'Department restructured', department: 'Finance', time: '3 days ago' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-600">{activity.department}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Other Report Types */}
        {selectedReport !== 'overview' && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                {reportTypes.find(r => r.id === selectedReport)?.icon && (
                  React.createElement(reportTypes.find(r => r.id === selectedReport).icon, {
                    className: "w-10 h-10 text-gray-400"
                  })
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {reportTypes.find(r => r.id === selectedReport)?.label} Report
              </h3>
              <p className="text-gray-600 mb-8">
                Detailed {selectedReport} analytics and insights will be displayed here.
              </p>
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300">
                Generate Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;

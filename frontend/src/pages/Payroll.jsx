import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Download, 
  FileText,
  CreditCard,
  PieChart,
  BarChart3,
  Filter,
  Search,
  Eye,
  Send
} from 'lucide-react';
import toast from 'react-hot-toast';

const Payroll = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [payrollData, setPayrollData] = useState([]);
  const [stats, setStats] = useState({
    totalPayroll: 0,
    employeeCount: 0,
    averageSalary: 0,
    processedPayments: 0
  });

  // Mock data
  useEffect(() => {
    const mockData = [
      {
        id: 1,
        name: 'John Doe',
        position: 'Senior Developer',
        department: 'IT',
        baseSalary: 5000,
        overtime: 500,
        bonuses: 200,
        deductions: 150,
        netPay: 5550,
        status: 'processed',
        payDate: '2024-01-31'
      },
      {
        id: 2,
        name: 'Jane Smith',
        position: 'HR Manager',
        department: 'HR',
        baseSalary: 4500,
        overtime: 0,
        bonuses: 300,
        deductions: 120,
        netPay: 4680,
        status: 'pending',
        payDate: '2024-01-31'
      },
      {
        id: 3,
        name: 'Mike Johnson',
        position: 'Accountant',
        department: 'Finance',
        baseSalary: 4000,
        overtime: 250,
        bonuses: 0,
        deductions: 100,
        netPay: 4150,
        status: 'processed',
        payDate: '2024-01-31'
      }
    ];
    
    setPayrollData(mockData);
    
    const totalPayroll = mockData.reduce((sum, emp) => sum + emp.netPay, 0);
    setStats({
      totalPayroll,
      employeeCount: mockData.length,
      averageSalary: Math.round(totalPayroll / mockData.length),
      processedPayments: mockData.filter(emp => emp.status === 'processed').length
    });
  }, [selectedMonth]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'processed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 px-8 py-12 relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">Payroll Management</h1>
                  <p className="text-green-100 text-lg">Manage employee compensation & benefits</p>
                </div>
              </div>
              
              <div className="hidden lg:block text-right">
                <div className="text-3xl font-bold text-white mb-1">${stats.totalPayroll.toLocaleString()}</div>
                <div className="text-green-100">Total Payroll</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Payroll</p>
                <p className="text-3xl font-bold text-green-600">${stats.totalPayroll.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Employees</p>
                <p className="text-3xl font-bold text-blue-600">{stats.employeeCount}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Average Salary</p>
                <p className="text-3xl font-bold text-purple-600">${stats.averageSalary.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Processed</p>
                <p className="text-3xl font-bold text-orange-600">{stats.processedPayments}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <CreditCard className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pay Period</label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  className="pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              
              <button className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300">
                <Send className="w-4 h-4" />
                <span>Process Payroll</span>
              </button>
            </div>
          </div>
        </div>

        {/* Payroll Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Payroll for {new Date(selectedMonth).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long' 
              })}
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Employee</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Base Salary</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Overtime</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Bonuses</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Deductions</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Net Pay</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {payrollData.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {employee.name[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{employee.name}</p>
                          <p className="text-sm text-gray-600">{employee.position}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900">${employee.baseSalary.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-900">${employee.overtime.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-900">${employee.bonuses.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-900">-${employee.deductions.toLocaleString()}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">${employee.netPay.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(employee.status)}`}>
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-blue-600 hover:text-blue-800">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-green-600 hover:text-green-800">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payroll;

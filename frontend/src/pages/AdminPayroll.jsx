import React, { useEffect, useState } from "react";
import { payrollAPI, employeeAPI } from "../services/api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Calendar, 
  Edit, 
  Eye, 
  CheckCircle, 
  Clock, 
  Download,
  Plus,
  Search,
  Filter,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  CreditCard,
  Banknote,
  Wallet,
  X,
  Save,
  Upload,
  Send,
  AlertCircle,
  FileText,
  Calculator,
  RefreshCw,
  Settings,
  History,
  Trash2,
  Lock,
  Unlock,
  CheckSquare,
  Square
} from "lucide-react";
import dayjs from "dayjs";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function AdminPayroll() {
  const { user } = useAuth();
  const [payrolls, setPayrolls] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [exporting, setExporting] = useState(false);
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [selectedPayrolls, setSelectedPayrolls] = useState([]);
  const [animatedStats, setAnimatedStats] = useState({
    totalPayroll: 0,
    pendingPayroll: 0,
    completedPayroll: 0,
    avgSalary: 0,
    totalEmployees: 0,
    monthlyBudget: 0
  });

  // Modal states
  const [modalType, setModalType] = useState("view"); // view, edit, create, bulk, history
  const [editForm, setEditForm] = useState({
    employeeId: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    basicSalary: "",
    allowances: "",
    deductions: "",
    overtime: "",
    bonus: "",
    totalAmount: "",
    status: "pending",
    notes: ""
  });

  // Bulk operations state
  const [bulkAction, setBulkAction] = useState({
    type: "",
    percentage: 0,
    amount: 0,
    reason: ""
  });

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    fetchPayrolls();
    fetchEmployees();
  }, []);

  // Animate statistics
  useEffect(() => {
    if (payrolls.length > 0) {
      const total = payrolls.reduce((sum, p) => sum + (p.totalAmount || p.amount || 0), 0);
      const pending = payrolls.filter(p => p.status === "pending").length;
      const completed = payrolls.filter(p => p.status === "released").length;
      const avgSalary = total / payrolls.length;
      const totalEmployees = new Set(payrolls.map(p => p.employee?._id)).size;

      // Animate numbers
      const duration = 1500;
      const steps = 60;
      const stepTime = duration / steps;
      
      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const progress = Math.min(currentStep / steps, 1);
        
        setAnimatedStats({
          totalPayroll: Math.floor(total * progress),
          pendingPayroll: Math.floor(pending * progress),
          completedPayroll: Math.floor(completed * progress),
          avgSalary: Math.floor(avgSalary * progress),
          totalEmployees: Math.floor(totalEmployees * progress),
          monthlyBudget: Math.floor((total * 1.2) * progress)
        });
        
        if (progress >= 1) clearInterval(timer);
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [payrolls]);

  const fetchPayrolls = async () => {
    setLoading(true);
    try {
      const res = await payrollAPI.getPayroll();
      setPayrolls(res.data.payrolls || []);
    } catch (error) {
      toast.error("Failed to load payroll data");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await employeeAPI.getAllEmployees();
      setEmployees(res.data.employees || []);
    } catch (error) {
      console.error("Failed to fetch employees");
    }
  };

  const calculateTotalAmount = () => {
    const basic = parseFloat(editForm.basicSalary) || 0;
    const allowances = parseFloat(editForm.allowances) || 0;
    const overtime = parseFloat(editForm.overtime) || 0;
    const bonus = parseFloat(editForm.bonus) || 0;
    const deductions = parseFloat(editForm.deductions) || 0;
    
    const total = basic + allowances + overtime + bonus - deductions;
    setEditForm(prev => ({ ...prev, totalAmount: total.toString() }));
  };

  useEffect(() => {
    calculateTotalAmount();
  }, [editForm.basicSalary, editForm.allowances, editForm.deductions, editForm.overtime, editForm.bonus]);

  const handleReleasePayroll = async (id) => {
    if (!window.confirm("Are you sure you want to release this payroll? This action cannot be undone.")) return;
    
    try {
      await payrollAPI.releasePayroll(id);
      toast.success("Payroll released successfully!");
      fetchPayrolls();
    } catch (error) {
      toast.error("Failed to release payroll");
    }
  };

  const handleBulkRelease = async () => {
    if (selectedPayrolls.length === 0) {
      toast.error("No payrolls selected");
      return;
    }
    
    if (!window.confirm(`Release ${selectedPayrolls.length} payroll(s)? This action cannot be undone.`)) return;
    
    setBulkProcessing(true);
    try {
      for (const id of selectedPayrolls) {
        await payrollAPI.releasePayroll(id);
      }
      toast.success(`${selectedPayrolls.length} payroll(s) released successfully!`);
      setSelectedPayrolls([]);
      fetchPayrolls();
    } catch (error) {
      toast.error("Failed to release some payrolls");
    } finally {
      setBulkProcessing(false);
    }
  };

  const handleEditPayroll = async (e) => {
    e.preventDefault();
    try {
      const payrollData = {
        ...editForm,
        basicSalary: parseFloat(editForm.basicSalary) || 0,
        allowances: parseFloat(editForm.allowances) || 0,
        deductions: parseFloat(editForm.deductions) || 0,
        overtime: parseFloat(editForm.overtime) || 0,
        bonus: parseFloat(editForm.bonus) || 0,
        totalAmount: parseFloat(editForm.totalAmount) || 0
      };

      if (modalType === "create") {
        await payrollAPI.createPayroll(payrollData);
        toast.success("Payroll created successfully!");
      } else {
        await payrollAPI.updatePayroll(selectedPayroll._id, payrollData);
        toast.success("Payroll updated successfully!");
      }
      
      setShowModal(false);
      fetchPayrolls();
    } catch (error) {
      toast.error("Failed to save payroll");
    }
  };

  const handleDeletePayroll = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payroll? This action cannot be undone.")) return;
    
    try {
      await payrollAPI.deletePayroll(id);
      toast.success("Payroll deleted successfully!");
      fetchPayrolls();
    } catch (error) {
      toast.error("Failed to delete payroll");
    }
  };

  const exportPayroll = async () => {
    setExporting(true);
    try {
      const res = await payrollAPI.exportPayroll();
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payroll_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Payroll exported successfully!");
    } catch (error) {
      toast.error("Export failed");
    } finally {
      setExporting(false);
    }
  };

  const openModal = (type, payroll = null) => {
    setModalType(type);
    if (payroll) {
      setSelectedPayroll(payroll);
      setEditForm({
        employeeId: payroll.employee._id,
        month: payroll.month,
        year: payroll.year,
        basicSalary: payroll.basicSalary?.toString() || payroll.amount?.toString() || "",
        allowances: payroll.allowances?.toString() || "",
        deductions: payroll.deductions?.toString() || "",
        overtime: payroll.overtime?.toString() || "",
        bonus: payroll.bonus?.toString() || "",
        totalAmount: payroll.totalAmount?.toString() || payroll.amount?.toString() || "",
        status: payroll.status,
        notes: payroll.notes || ""
      });
    } else {
      setSelectedPayroll(null);
      setEditForm({
        employeeId: "",
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        basicSalary: "",
        allowances: "",
        deductions: "",
        overtime: "",
        bonus: "",
        totalAmount: "",
        status: "pending",
        notes: ""
      });
    }
    setShowModal(true);
  };

  const togglePayrollSelection = (id) => {
    setSelectedPayrolls(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };

  const selectAllPayrolls = () => {
    const allIds = filteredPayrolls.map(p => p._id);
    setSelectedPayrolls(prev => 
      prev.length === allIds.length ? [] : allIds
    );
  };

  const filteredPayrolls = payrolls.filter(payroll => {
    const matchesSearch = payroll.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || payroll.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Payroll Management
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Complete payroll administration with advanced editing, releasing, and management capabilities
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <StatCard
            icon={Wallet}
            title="Total Payroll"
            value={`₹${animatedStats.totalPayroll.toLocaleString()}`}
            subtitle="Current month"
            color="from-green-500 to-emerald-500"
            trend={12}
          />
          <StatCard
            icon={Clock}
            title="Pending"
            value={animatedStats.pendingPayroll}
            subtitle="Awaiting release"
            color="from-yellow-500 to-orange-500"
            trend={-5}
          />
          <StatCard
            icon={CheckCircle}
            title="Released"
            value={animatedStats.completedPayroll}
            subtitle="Successfully processed"
            color="from-blue-500 to-indigo-500"
            trend={8}
          />
          <StatCard
            icon={Users}
            title="Employees"
            value={animatedStats.totalEmployees}
            subtitle="Total workforce"
            color="from-purple-500 to-pink-500"
            trend={3}
          />
          <StatCard
            icon={BarChart3}
            title="Average Salary"
            value={`₹${animatedStats.avgSalary.toLocaleString()}`}
            subtitle="Per employee"
            color="from-cyan-500 to-blue-500"
            trend={2}
          />
          <StatCard
            icon={Calculator}
            title="Monthly Budget"
            value={`₹${animatedStats.monthlyBudget.toLocaleString()}`}
            subtitle="Allocated budget"
            color="from-indigo-500 to-purple-500"
            trend={5}
          />
        </div>

        {/* Controls Section */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full sm:w-64 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300"
                />
              </div>

              {/* Filter */}
              <div className="relative group">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-purple-500 transition-colors" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none cursor-pointer transition-all duration-300"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="released">Released</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Bulk Actions */}
              {selectedPayrolls.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedPayrolls.length} selected
                  </span>
                  <button
                    onClick={handleBulkRelease}
                    disabled={bulkProcessing}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors text-sm disabled:opacity-50"
                  >
                    {bulkProcessing ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>Release Selected</span>
                  </button>
                </div>
              )}

              <button
                onClick={() => openModal("create")}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 group"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                <span>Add Payroll</span>
              </button>
              
              <button
                onClick={exportPayroll}
                disabled={exporting}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 group"
              >
                {exporting ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Download className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                )}
                <span>{exporting ? "Exporting..." : "Export"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Payroll Table */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payroll Records</h2>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                  {filteredPayrolls.length} records
                </span>
              </div>
              
              <button
                onClick={selectAllPayrolls}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
              >
                {selectedPayrolls.length === filteredPayrolls.length ? (
                  <CheckSquare className="w-4 h-4" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
                <span>Select All</span>
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedPayrolls.length === filteredPayrolls.length && filteredPayrolls.length > 0}
                      onChange={selectAllPayrolls}
                      className="rounded focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Period</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Basic Salary</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPayrolls.map((payroll, index) => (
                  <tr 
                    key={payroll._id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedPayrolls.includes(payroll._id)}
                        onChange={() => togglePayrollSelection(payroll._id)}
                        className="rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {payroll.employee?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {payroll.employee?.name || 'Unknown'}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {payroll.employee?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {months[payroll.month - 1]} {payroll.year}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        ₹{(payroll.basicSalary || payroll.amount)?.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-bold text-green-600">
                        ₹{(payroll.totalAmount || payroll.amount)?.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        payroll.status === "released"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : payroll.status === "pending"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                      }`}>
                        {payroll.status === "released" ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : payroll.status === "pending" ? (
                          <Clock className="w-3 h-3 mr-1" />
                        ) : (
                          <Edit className="w-3 h-3 mr-1" />
                        )}
                        {payroll.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => openModal("view", payroll)}
                        className="inline-flex items-center px-3 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200 group"
                      >
                        <Eye className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform duration-200" />
                        View
                      </button>
                      
                      <button
                        onClick={() => openModal("edit", payroll)}
                        className="inline-flex items-center px-3 py-1.5 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors duration-200 group"
                      >
                        <Edit className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform duration-200" />
                        Edit
                      </button>
                      
                      {payroll.status === "pending" && (
                        <button
                          onClick={() => handleReleasePayroll(payroll._id)}
                          className="inline-flex items-center px-3 py-1.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors duration-200 group"
                        >
                          <Send className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform duration-200" />
                          Release
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDeletePayroll(payroll._id)}
                        className="inline-flex items-center px-3 py-1.5 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors duration-200 group"
                      >
                        <Trash2 className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform duration-200" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredPayrolls.length === 0 && !loading && (
              <div className="text-center py-16">
                <Banknote className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  No payroll records found
                </h3>
                <p className="text-gray-500 dark:text-gray-500">
                  {searchTerm || filterStatus !== "all" 
                    ? "Try adjusting your search or filter criteria" 
                    : "Start by adding your first payroll record"
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              {modalType === "view" ? (
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                      <FileText className="w-6 h-6" />
                      <span>Payroll Details</span>
                    </h2>
                    <button
                      onClick={() => setShowModal(false)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Employee Info */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4">Employee Information</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
                          <div className="text-lg font-semibold text-gray-900 dark:text-white">
                            {selectedPayroll?.employee?.name}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {selectedPayroll?.employee?.email}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Department</label>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {selectedPayroll?.employee?.department || 'Not specified'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payroll Period */}
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-4">Payroll Period</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Period</label>
                          <div className="text-lg font-semibold text-gray-900 dark:text-white">
                            {months[selectedPayroll?.month - 1]} {selectedPayroll?.year}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            selectedPayroll?.status === "released"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          }`}>
                            {selectedPayroll?.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Salary Breakdown */}
                  <div className="mt-8 bg-green-50 dark:bg-green-900/20 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-4">Salary Breakdown</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          ₹{(selectedPayroll?.basicSalary || selectedPayroll?.amount)?.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">Basic Salary</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          ₹{selectedPayroll?.allowances?.toLocaleString() || '0'}
                        </div>
                        <div className="text-sm text-gray-500">Allowances</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          ₹{selectedPayroll?.bonus?.toLocaleString() || '0'}
                        </div>
                        <div className="text-sm text-gray-500">Bonus</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          ₹{selectedPayroll?.deductions?.toLocaleString() || '0'}
                        </div>
                        <div className="text-sm text-gray-500">Deductions</div>
                      </div>
                    </div>
                    
                    <div className="border-t border-green-200 dark:border-green-700 mt-6 pt-6 text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        ₹{(selectedPayroll?.totalAmount || selectedPayroll?.amount)?.toLocaleString()}
                      </div>
                      <div className="text-lg text-green-700 dark:text-green-300">Total Amount</div>
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedPayroll?.notes && (
                    <div className="mt-6 bg-gray-50 dark:bg-gray-700 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-300 mb-2">Notes</h3>
                      <p className="text-gray-600 dark:text-gray-400">{selectedPayroll.notes}</p>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleEditPayroll} className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                      <Calculator className="w-6 h-6" />
                      <span>{modalType === "create" ? "Create Payroll" : "Edit Payroll"}</span>
                    </h2>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Employee Selection */}
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Employee *
                      </label>
                      <select
                        value={editForm.employeeId}
                        onChange={(e) => setEditForm({ ...editForm, employeeId: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        required
                        disabled={modalType === "edit"}
                      >
                        <option value="">Select Employee</option>
                        {employees.map((emp) => (
                          <option key={emp._id} value={emp._id}>
                            {emp.name} ({emp.email})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Period Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Month *
                      </label>
                      <select
                        value={editForm.month}
                        onChange={(e) => setEditForm({ ...editForm, month: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        required
                      >
                        {months.map((month, index) => (
                          <option key={index} value={index + 1}>
                            {month}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Year *
                      </label>
                      <input
                        type="number"
                        value={editForm.year}
                        onChange={(e) => setEditForm({ ...editForm, year: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        min="2020"
                        max="2030"
                        required
                      />
                    </div>

                    {/* Salary Components */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Basic Salary *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                        <input
                          type="number"
                          value={editForm.basicSalary}
                          onChange={(e) => setEditForm({ ...editForm, basicSalary: e.target.value })}
                          className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="Enter basic salary"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Allowances
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                        <input
                          type="number"
                          value={editForm.allowances}
                          onChange={(e) => setEditForm({ ...editForm, allowances: e.target.value })}
                          className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="Enter allowances"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Overtime
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                        <input
                          type="number"
                          value={editForm.overtime}
                          onChange={(e) => setEditForm({ ...editForm, overtime: e.target.value })}
                          className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="Enter overtime pay"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bonus
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                        <input
                          type="number"
                          value={editForm.bonus}
                          onChange={(e) => setEditForm({ ...editForm, bonus: e.target.value })}
                          className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="Enter bonus amount"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Deductions
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                        <input
                          type="number"
                          value={editForm.deductions}
                          onChange={(e) => setEditForm({ ...editForm, deductions: e.target.value })}
                          className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="Enter deductions"
                        />
                      </div>
                    </div>

                    {/* Total Amount Display */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Total Amount
                      </label>
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border-2 border-green-200 dark:border-green-700">
                        <div className="text-2xl font-bold text-green-600">
                          ₹{parseFloat(editForm.totalAmount || 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-green-700 dark:text-green-300">Calculated automatically</div>
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Status
                      </label>
                      <select
                        value={editForm.status}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      >
                        <option value="draft">Draft</option>
                        <option value="pending">Pending</option>
                        <option value="released">Released</option>
                      </select>
                    </div>

                    {/* Notes */}
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Notes
                      </label>
                      <textarea
                        value={editForm.notes}
                        onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Add any additional notes..."
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                    >
                      <Save className="w-4 h-4" />
                      <span>{modalType === "create" ? "Create Payroll" : "Save Changes"}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

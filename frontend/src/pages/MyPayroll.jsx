import React, { useEffect, useState } from "react";
import { payrollAPI } from "../services/api";
import toast from "react-hot-toast";
import { 
  DollarSign, 
  Download, 
  Calendar, 
  TrendingUp, 
  Award, 
  Banknote,
  Eye,
  FileText,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  CreditCard
} from "lucide-react";
import dayjs from "dayjs";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function MyPayroll() {
  const [payrolls, setPayrolls] = useState([]);
  const [exporting, setExporting] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [animatedStats, setAnimatedStats] = useState({
    totalEarned: 0,
    avgSalary: 0,
    lastPayment: 0,
    paymentsCount: 0
  });

  useEffect(() => {
    fetchPayrolls();
  }, []);

  // Animate statistics
  useEffect(() => {
    if (payrolls.length > 0) {
      const currentYearPayrolls = payrolls.filter(p => p.year === selectedYear);
      const total = currentYearPayrolls.reduce((sum, p) => sum + (p.amount || 0), 0);
      const avg = total / (currentYearPayrolls.length || 1);
      const lastPayment = currentYearPayrolls[0]?.amount || 0;
      
      const duration = 1500;
      const steps = 60;
      const stepTime = duration / steps;
      
      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const progress = Math.min(currentStep / steps, 1);
        
        setAnimatedStats({
          totalEarned: Math.floor(total * progress),
          avgSalary: Math.floor(avg * progress),
          lastPayment: Math.floor(lastPayment * progress),
          paymentsCount: Math.floor(currentYearPayrolls.length * progress)
        });
        
        if (progress >= 1) clearInterval(timer);
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [payrolls, selectedYear]);

  const fetchPayrolls = async () => {
    try {
      const res = await payrollAPI.getMyPayroll();
      setPayrolls(res.data.payrolls || []);
    } catch (error) {
      toast.error("Failed to load payroll");
    }
  };

  const exportMyPayroll = async () => {
    setExporting(true);
    try {
      const res = await payrollAPI.exportMyPayroll();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "my-payroll.csv";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Payroll exported!");
    } catch (error) {
      toast.error("Export failed");
    } finally {
      setExporting(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color, trend }) => (
    <div className="group relative bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
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

  const currentYearPayrolls = payrolls.filter(p => p.year === selectedYear);
  const availableYears = [...new Set(payrolls.map(p => p.year))].sort((a, b) => b - a);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-6">
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slideInFromBottom {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes fadeInScale {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-slide-up {
          animation: slideInFromBottom 0.6s ease-out forwards;
        }
        
        .animate-fade-scale {
          animation: fadeInScale 0.8s ease-out forwards;
        }
        
        .shimmer {
          position: relative;
          overflow: hidden;
        }
        
        .shimmer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          animation: shimmer 2s infinite;
        }
      `}</style>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-scale">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl animate-bounce">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              My Payroll
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Track your salary payments, download payslips, and view earnings history
          </p>
        </div>

        {/* Year Selector & Export */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 animate-slide-up">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {currentYearPayrolls.length} payments
              </span>
            </div>
            
            <button
              onClick={exportMyPayroll}
              disabled={exporting}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 group"
            >
              {exporting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Download className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              )}
              <span>{exporting ? "Exporting..." : "Export Payslips"}</span>
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <StatCard
              icon={Banknote}
              title="Total Earned"
              value={`₹${animatedStats.totalEarned}`}
              subtitle="This year"
              color="from-green-500 to-emerald-500"
              trend={15}
            />
          </div>
          
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <StatCard
              icon={BarChart3}
              title="Average Salary"
              value={`₹${animatedStats.avgSalary}`}
              subtitle="Per month"
              color="from-blue-500 to-indigo-500"
              trend={8}
            />
          </div>
          
          <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <StatCard
              icon={Award}
              title="Last Payment"
              value={`₹${animatedStats.lastPayment}`}
              subtitle="Most recent"
              color="from-purple-500 to-pink-500"
              trend={5}
            />
          </div>
          
          <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <StatCard
              icon={CreditCard}
              title="Payments"
              value={animatedStats.paymentsCount}
              subtitle="Total count"
              color="from-orange-500 to-red-500"
              trend={12}
            />
          </div>
        </div>

        {/* Payroll History */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-slide-up">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payroll History</h2>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
                {selectedYear}
              </span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Month</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Release Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {currentYearPayrolls.map((payroll, index) => (
                  <tr 
                    key={payroll._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 group shimmer"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                          {months[payroll.month - 1]?.substring(0, 1)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {months[payroll.month - 1]} {payroll.year}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Salary Payment
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-2xl font-bold text-green-600">
                        ₹{payroll.amount?.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        payroll.status === "paid" || payroll.status === "released"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      }`}>
                        {payroll.status === "paid" || payroll.status === "released" ? "Paid" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {payroll.releaseDate 
                        ? dayjs(payroll.releaseDate).format("MMM DD, YYYY")
                        : "—"
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200 group">
                        <Eye className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                        View Slip
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {currentYearPayrolls.length === 0 && (
              <div className="text-center py-16">
                <Banknote className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  No payroll records for {selectedYear}
                </h3>
                <p className="text-gray-500 dark:text-gray-500">
                  Check back later or select a different year
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Earnings Chart Placeholder */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Earnings Trend</h2>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {selectedYear}
            </div>
          </div>
          
          <div className="h-64 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Earnings chart coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

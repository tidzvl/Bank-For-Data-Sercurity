import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import {
  MdMenu,
  MdNotifications,
  MdCheckCircle,
  MdCancel,
  MdPeople,
  MdAccountBalance,
  MdAssignment,
  MdTrendingUp,
  MdWarning,
  MdSupervisorAccount,
  MdBarChart
} from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { directorAPI } from '../../services/api';

export default function DirectorDashboard() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({});
  const [auditLog, setAuditLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pendingData, employeesData, statsData] = await Promise.all([
        directorAPI.getPendingApprovals(),
        directorAPI.getEmployees(),
        directorAPI.getStats()
      ]);

      setPendingTransactions(pendingData.transactions || []);
      setEmployees(employeesData.employees || []);
      setStats(statsData.stats || {});

      // Optionally load audit trail
      try {
        const auditData = await directorAPI.getAuditTrail({ limit: 3 });
        setAuditLog(auditData.logs || []);
      } catch (err) {
        console.error('Error loading audit log:', err);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const recentAuditLog = auditLog.slice(0, 3);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleApprove = (transaction) => {
    setSelectedTransaction(transaction);
    setShowApprovalModal(true);
  };

  const handleReject = async (transactionId) => {
    if (confirm('Bạn có chắc muốn từ chối giao dịch này?')) {
      try {
        await directorAPI.rejectTransaction(transactionId);
        alert('Đã từ chối giao dịch thành công!');
        loadData(); // Reload data
      } catch (err) {
        alert(err.message || 'Lỗi khi từ chối giao dịch');
      }
    }
  };

  const confirmApproval = async () => {
    try {
      await directorAPI.approveTransaction(selectedTransaction.id);
      alert('Duyệt giao dịch thành công!');
      setShowApprovalModal(false);
      setSelectedTransaction(null);
      loadData(); // Reload data
    } catch (err) {
      alert(err.message || 'Lỗi khi duyệt giao dịch');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <MdMenu size={24} />
              </button>
              <div>
                <h1 className="text-xl font-semibold">Dashboard - Giám đốc</h1>
                <p className="text-sm text-gray-500">Xin chào, {user?.fullname}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <MdNotifications size={24} />
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                  {stats.pendingApprovals}
                </span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-dark-bg text-white rounded-full flex items-center justify-center font-semibold">
                  {user?.username?.substring(0, 2).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Stats Overview */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <MdPeople size={32} className="opacity-80" />
                <MdTrendingUp size={24} className="opacity-60" />
              </div>
              <p className="text-sm opacity-90 mb-1">Tổng khách hàng</p>
              <p className="text-3xl font-bold">{stats.totalCustomers}</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <MdAccountBalance size={32} className="opacity-80" />
                <MdTrendingUp size={24} className="opacity-60" />
              </div>
              <p className="text-sm opacity-90 mb-1">Tổng số dư hệ thống</p>
              <p className="text-2xl font-bold">{formatCurrency(stats.totalBalance)}</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <MdAssignment size={32} className="opacity-80" />
                <MdWarning size={24} className="opacity-60" />
              </div>
              <p className="text-sm opacity-90 mb-1">Phiếu chờ duyệt</p>
              <p className="text-3xl font-bold">{stats.pendingApprovals}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <MdSupervisorAccount size={32} className="opacity-80" />
                <MdBarChart size={24} className="opacity-60" />
              </div>
              <p className="text-sm opacity-90 mb-1">Tổng nhân viên</p>
              <p className="text-3xl font-bold">{stats.totalEmployees}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Pending Approvals */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MdAssignment size={24} className="text-yellow-600" />
                  Phiếu giao dịch chờ duyệt
                </h3>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                  {pendingTransactions.length} phiếu
                </span>
              </div>

              <div className="space-y-4">
                {pendingTransactions.map((transaction) => {
                  const afterBalance = transaction.type === 'DEPOSIT'
                    ? transaction.currentBalance + transaction.amount
                    : transaction.currentBalance - transaction.amount;

                  return (
                    <div
                      key={transaction.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-yellow-400 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-lg">#{transaction.id}</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              transaction.type === 'DEPOSIT'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {transaction.type === 'DEPOSIT' ? 'NẠP TIỀN' : 'RÚT TIỀN'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Khách hàng: <span className="font-medium">{transaction.customerName}</span> (@{transaction.customer})
                          </p>
                          <p className="text-sm text-gray-600">
                            Tài khoản: <span className="font-medium">#{transaction.account_id}</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-2xl font-bold ${
                            transaction.type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'DEPOSIT' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3 p-3 bg-gray-50 rounded">
                        <div>
                          <p className="text-xs text-gray-500">Số dư hiện tại</p>
                          <p className="font-semibold">{formatCurrency(transaction.currentBalance)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Số dư sau GD</p>
                          <p className="font-semibold text-blue-600">{formatCurrency(afterBalance)}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <div className="text-xs text-gray-500">
                          <p>Tạo bởi: {transaction.createdBy}</p>
                          <p>{transaction.date}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReject(transaction.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            <MdCancel size={18} />
                            Từ chối
                          </button>
                          <button
                            onClick={() => handleApprove(transaction)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <MdCheckCircle size={18} />
                            Duyệt
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Link
                to="/director/approvals"
                className="block text-center text-sm text-dark-bg hover:underline mt-4"
              >
                Xem tất cả phiếu chờ duyệt →
              </Link>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Thống kê tháng này</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Giao dịch</span>
                    <span className="font-semibold">{stats.monthlyTransactions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tài khoản mới</span>
                    <span className="font-semibold text-green-600">+3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Khách hàng mới</span>
                    <span className="font-semibold text-blue-600">+2</span>
                  </div>
                </div>
              </div>

              {/* Employee List */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Nhân viên</h3>
                  <Link to="/director/employees" className="text-sm text-dark-bg hover:underline">
                    Xem tất cả
                  </Link>
                </div>
                <div className="space-y-3">
                  {employees.map((emp) => (
                    <div key={emp.username} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-dark-bg text-white rounded-full flex items-center justify-center font-semibold text-sm">
                          {emp.username.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{emp.fullname}</p>
                          <p className="text-xs text-gray-500">{emp.position}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Audit Log */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Audit Log</h3>
                  <Link to="/director/audit" className="text-sm text-dark-bg hover:underline">
                    Xem chi tiết
                  </Link>
                </div>
                <div className="space-y-3">
                  {recentAuditLog.map((log, index) => (
                    <div key={index} className="pb-3 border-b border-gray-100 last:border-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700">{log.user}</span>
                        <span className="text-xs text-gray-500">{log.time}</span>
                      </div>
                      <p className="text-xs text-gray-600">
                        <span className="font-medium text-blue-600">{log.action}</span> on {log.object}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Approval Modal */}
      {showApprovalModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MdCheckCircle size={24} className="text-green-600" />
              Xác nhận duyệt giao dịch
            </h3>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Mã giao dịch</p>
                  <p className="font-semibold">#{selectedTransaction.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Khách hàng</p>
                  <p className="font-semibold">{selectedTransaction.customerName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Tài khoản</p>
                  <p className="font-semibold">#{selectedTransaction.account_id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Loại GD</p>
                  <p className="font-semibold">
                    {selectedTransaction.type === 'DEPOSIT' ? 'Nạp tiền' : 'Rút tiền'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Số dư hiện tại</p>
                  <p className="font-semibold">{formatCurrency(selectedTransaction.currentBalance)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Số tiền GD</p>
                  <p className={`font-bold text-lg ${
                    selectedTransaction.type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {selectedTransaction.type === 'DEPOSIT' ? '+' : '-'}
                    {formatCurrency(selectedTransaction.amount)}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Số dư sau giao dịch</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(
                    selectedTransaction.type === 'DEPOSIT'
                      ? selectedTransaction.currentBalance + selectedTransaction.amount
                      : selectedTransaction.currentBalance - selectedTransaction.amount
                  )}
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800">
                ⚠️ Trigger sẽ tự động cập nhật số dư khi bạn duyệt giao dịch này.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowApprovalModal(false);
                  setSelectedTransaction(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmApproval}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Xác nhận duyệt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

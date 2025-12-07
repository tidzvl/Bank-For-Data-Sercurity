import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { MdMenu, MdBarChart, MdTrendingUp, MdPeople, MdAccountBalance, MdAssignment } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { directorAPI, staffAPI } from '../../services/api';

export default function DirectorAnalytics() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, accountsData, transactionsData] = await Promise.all([
        directorAPI.getStats(),
        staffAPI.getAccounts(),
        staffAPI.getTransactions()
      ]);

      setStats(statsData.stats || {});
      setAccounts(accountsData.accounts || []);
      setTransactions(transactionsData.transactions || []);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Calculate analytics
  const analytics = {
    totalBalance: accounts.reduce((sum, a) => sum + (a.balance || 0), 0),
    avgBalance: accounts.length > 0
      ? accounts.reduce((sum, a) => sum + (a.balance || 0), 0) / accounts.length
      : 0,
    totalTransactions: transactions.length,
    totalCustomers: stats.totalCustomers || 0,
    activeAccounts: accounts.filter(a => a.status === 'active').length,
    lockedAccounts: accounts.filter(a => a.status !== 'active').length,
    depositTransactions: transactions.filter(t => t.type === 'DEPOSIT' || t.transaction_type === 'DEPOSIT').length,
    withdrawTransactions: transactions.filter(t => t.type === 'WITHDRAW' || t.transaction_type === 'WITHDRAW').length
  };

  // Account type distribution
  const accountTypeDistribution = {
    CHECKING: accounts.filter(a => a.account_type === 'CHECKING').length,
    SAVINGS: accounts.filter(a => a.account_type === 'SAVINGS').length,
    CREDIT: accounts.filter(a => a.account_type === 'CREDIT').length
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
              <MdMenu size={24} />
            </button>
            <div>
              <h1 className="text-xl font-semibold">Phân tích & Báo cáo</h1>
              <p className="text-sm text-gray-500">Thống kê và biểu đồ phân tích</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-gray-500">Đang tải...</div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Overview Stats */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <MdAccountBalance size={32} className="opacity-80" />
                    <MdTrendingUp size={24} className="opacity-60" />
                  </div>
                  <p className="text-sm opacity-90 mb-1">Tổng số dư hệ thống</p>
                  <p className="text-2xl font-bold">{formatCurrency(analytics.totalBalance)}</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <MdPeople size={32} className="opacity-80" />
                  </div>
                  <p className="text-sm opacity-90 mb-1">Tổng khách hàng</p>
                  <p className="text-3xl font-bold">{analytics.totalCustomers}</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <MdAccountBalance size={32} className="opacity-80" />
                  </div>
                  <p className="text-sm opacity-90 mb-1">Số dư TB/Tài khoản</p>
                  <p className="text-2xl font-bold">{formatCurrency(analytics.avgBalance)}</p>
                </div>

                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <MdAssignment size={32} className="opacity-80" />
                  </div>
                  <p className="text-sm opacity-90 mb-1">Tổng giao dịch</p>
                  <p className="text-3xl font-bold">{analytics.totalTransactions}</p>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Account Status */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MdBarChart size={24} className="text-blue-600" />
                    Trạng thái tài khoản
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Đang hoạt động</span>
                        <span className="font-semibold text-green-600">{analytics.activeAccounts}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-green-600 h-3 rounded-full transition-all"
                          style={{ width: `${(analytics.activeAccounts / (analytics.activeAccounts + analytics.lockedAccounts) * 100) || 0}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Đã khóa</span>
                        <span className="font-semibold text-red-600">{analytics.lockedAccounts}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-red-600 h-3 rounded-full transition-all"
                          style={{ width: `${(analytics.lockedAccounts / (analytics.activeAccounts + analytics.lockedAccounts) * 100) || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transaction Types */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MdBarChart size={24} className="text-purple-600" />
                    Loại giao dịch
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Nạp tiền</span>
                        <span className="font-semibold text-green-600">{analytics.depositTransactions}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-green-600 h-3 rounded-full transition-all"
                          style={{ width: `${(analytics.depositTransactions / analytics.totalTransactions * 100) || 0}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Rút tiền</span>
                        <span className="font-semibold text-red-600">{analytics.withdrawTransactions}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-red-600 h-3 rounded-full transition-all"
                          style={{ width: `${(analytics.withdrawTransactions / analytics.totalTransactions * 100) || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Type Distribution */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MdBarChart size={24} className="text-teal-600" />
                    Phân loại tài khoản
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Tài khoản thanh toán</span>
                        <span className="font-semibold text-blue-600">{accountTypeDistribution.CHECKING}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-blue-600 h-3 rounded-full transition-all"
                          style={{ width: `${(accountTypeDistribution.CHECKING / accounts.length * 100) || 0}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Tài khoản tiết kiệm</span>
                        <span className="font-semibold text-green-600">{accountTypeDistribution.SAVINGS}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-green-600 h-3 rounded-full transition-all"
                          style={{ width: `${(accountTypeDistribution.SAVINGS / accounts.length * 100) || 0}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Tài khoản tín dụng</span>
                        <span className="font-semibold text-purple-600">{accountTypeDistribution.CREDIT}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-purple-600 h-3 rounded-full transition-all"
                          style={{ width: `${(accountTypeDistribution.CREDIT / accounts.length * 100) || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold mb-4">Tổng quan</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Tổng tài khoản</span>
                      <span className="font-semibold text-gray-900">{accounts.length}</span>
                    </div>
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Tổng giao dịch</span>
                      <span className="font-semibold text-gray-900">{analytics.totalTransactions}</span>
                    </div>
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Phiếu chờ duyệt</span>
                      <span className="font-semibold text-yellow-600">{stats.pendingApprovals || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Tổng nhân viên</span>
                      <span className="font-semibold text-gray-900">{stats.totalEmployees || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

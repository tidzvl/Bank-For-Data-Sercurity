import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import {
  MdMenu,
  MdNotifications,
  MdPeople,
  MdAccountBalance,
  MdAdd,
  MdSearch,
  MdAssignment,
  MdTrendingUp
} from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { staffAPI } from '../../services/api';

export default function StaffDashboard() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateTransactionModal, setShowCreateTransactionModal] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [customersData, transactionsData] = await Promise.all([
        staffAPI.getCustomers(),
        staffAPI.getTransactions()
      ]);

      setCustomers(customersData.customers || []);
      setTransactions(transactionsData.transactions || []);
    } catch (err) {
      setError(err.message);
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const recentTransactions = transactions.slice(0, 5);
  const stats = {
    totalCustomers: customers.length,
    activeAccounts: customers.reduce((sum, c) => sum + (c.accountCount || 0), 0),
    pendingTransactions: transactions.filter(t => t.status === 'pending').length,
    todayTransactions: transactions.length
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
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
                <h1 className="text-xl font-semibold">Trang chủ - Nhân viên</h1>
                <p className="text-sm text-gray-500">Xin chào, {user?.fullname}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <MdNotifications size={24} />
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                  {stats.pendingTransactions}
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
          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Tổng khách hàng</p>
                  <p className="text-2xl font-bold text-dark-bg">{stats.totalCustomers}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MdPeople size={24} className="text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Tài khoản hoạt động</p>
                  <p className="text-2xl font-bold text-dark-bg">{stats.activeAccounts}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <MdAccountBalance size={24} className="text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phiếu chờ duyệt</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pendingTransactions}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <MdAssignment size={24} className="text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">GD hôm nay</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.todayTransactions}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MdTrendingUp size={24} className="text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Customer Management */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Quản lý khách hàng</h3>
                <Link
                  to="/staff/customers/new"
                  className="flex items-center gap-2 px-4 py-2 bg-dark-bg text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <MdAdd size={20} />
                  Thêm KH mới
                </Link>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Tìm kiếm khách hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-bg"
                />
              </div>

              {/* Customer List */}
              <div className="space-y-3">
                {customers.map((customer) => (
                  <div
                    key={customer.username}
                    className="p-4 border border-gray-200 rounded-lg hover:border-dark-bg hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-dark-bg text-white rounded-full flex items-center justify-center font-semibold">
                          {customer.username.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold">{customer.fullname}</p>
                          <p className="text-sm text-gray-500">@{customer.username}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            CCCD: {customer.cccd} • SĐT: {customer.phone}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 mb-2">{customer.accountCount} tài khoản</p>
                        <div className="flex gap-2">
                          <Link
                            to={`/staff/customers/${customer.username}`}
                            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                          >
                            Chi tiết
                          </Link>
                          <Link
                            to={`/staff/accounts/new?customer=${customer.username}`}
                            className="px-3 py-1 text-sm bg-dark-bg text-white rounded hover:bg-gray-800 transition-colors"
                          >
                            Tạo TK
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions & Recent Transactions */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Thao tác nhanh</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowCreateTransactionModal(true)}
                    className="w-full flex items-center gap-3 p-3 bg-dark-bg text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <MdAdd size={20} />
                    <span>Tạo giao dịch mới</span>
                  </button>
                  <Link
                    to="/staff/customers/new"
                    className="w-full flex items-center gap-3 p-3 bg-gray-100 text-dark-bg rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <MdPeople size={20} />
                    <span>Thêm khách hàng</span>
                  </Link>
                  <Link
                    to="/staff/transactions"
                    className="w-full flex items-center gap-3 p-3 bg-gray-100 text-dark-bg rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <MdAssignment size={20} />
                    <span>Xem giao dịch</span>
                  </Link>
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Giao dịch gần đây</h3>
                <div className="space-y-3">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="pb-3 border-b border-gray-100 last:border-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium">{transaction.customer}</p>
                        <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                          Chờ duyệt
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          {transaction.type === 'DEPOSIT' ? 'Nạp tiền' : 'Rút tiền'} • TK #{transaction.account_id}
                        </p>
                        <p className={`text-sm font-semibold ${
                          transaction.type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'DEPOSIT' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{transaction.date}</p>
                    </div>
                  ))}
                </div>
                <Link
                  to="/staff/transactions"
                  className="block text-center text-sm text-dark-bg hover:underline mt-4"
                >
                  Xem tất cả
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Create Transaction Modal */}
      {showCreateTransactionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Tạo giao dịch mới</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Khách hàng</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-bg">
                  <option value="">Chọn khách hàng</option>
                  <option value="kh1">kh1 - Nguyen Van A</option>
                  <option value="kh2">kh2 - Tran Van B</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tài khoản</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-bg">
                  <option value="">Chọn tài khoản</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Loại giao dịch</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input type="radio" name="type" value="DEPOSIT" className="mr-2" />
                    Nạp tiền
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="type" value="WITHDRAW" className="mr-2" />
                    Rút tiền
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Số tiền</label>
                <input
                  type="number"
                  placeholder="Nhập số tiền"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-bg"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateTransactionModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-dark-bg text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Tạo phiếu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

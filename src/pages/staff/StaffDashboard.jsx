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
import { useToast } from '../../context/ToastContext';
import { staffAPI } from '../../services/api';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function StaffDashboard() {
  const { user, token } = useAuth();
  const { showToast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateTransactionModal, setShowCreateTransactionModal] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Transaction form states
  const [customerAccounts, setCustomerAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [transactionForm, setTransactionForm] = useState({
    customer_username: '',
    account_id: '',
    username: '',
    amount: '',
    type: 'DEPOSIT'
  });
  const [submitting, setSubmitting] = useState(false);

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
    activeAccounts: customers.reduce((sum, c) => sum + (c.activeAccountCount || 0), 0),
    pendingTransactions: transactions.filter(t => t.status === 'pending').length,
    todayTransactions: transactions.length
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Load customer accounts when customer is selected
  const loadCustomerAccounts = async (username) => {
    if (!username) {
      setCustomerAccounts([]);
      return;
    }

    try {
      setLoadingAccounts(true);
      const response = await axios.get(`${API_URL}/staff/customers/${username}/accounts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCustomerAccounts(response.data.accounts || []);
    } catch (err) {
      console.error('Error loading customer accounts:', err);
      showToast('Không thể tải tài khoản của khách hàng', 'error');
      setCustomerAccounts([]);
    } finally {
      setLoadingAccounts(false);
    }
  };

  // Handle customer selection
  const handleCustomerChange = (e) => {
    const username = e.target.value;
    setTransactionForm({
      ...transactionForm,
      customer_username: username,
      account_id: '',
      username: username
    });

    if (username) {
      loadCustomerAccounts(username);
    } else {
      setCustomerAccounts([]);
    }
  };

  // Handle transaction form submit
  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await axios.post(
        `${API_URL}/staff/transactions`,
        {
          account_id: parseInt(transactionForm.account_id),
          username: transactionForm.username,
          amount: parseFloat(transactionForm.amount),
          type: transactionForm.type
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      showToast(response.data.message || 'Tạo phiếu giao dịch thành công', 'success');

      // Reset form and close modal
      setTransactionForm({
        customer_username: '',
        account_id: '',
        username: '',
        amount: '',
        type: 'DEPOSIT'
      });
      setCustomerAccounts([]);
      setShowCreateTransactionModal(false);

      // Reload data
      loadData();

    } catch (err) {
      const errorData = err.response?.data;

      if (errorData?.trigger_info) {
        showToast(
          errorData.error,
          'error',
          errorData.trigger_info,
          8000
        );
      } else {
        showToast(
          errorData?.error || 'Không thể tạo giao dịch',
          'error'
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Get selected customer and account info
  const selectedCustomer = customers.find(c => c.username === transactionForm.customer_username);
  const selectedAccount = customerAccounts.find(acc => acc.id === parseInt(transactionForm.account_id));

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
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          transaction.status === 'accepted'
                            ? 'bg-green-100 text-green-700'
                            : transaction.status === 'rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {transaction.status === 'accepted' ? 'Đã duyệt' : transaction.status === 'rejected' ? 'Từ chối' : 'Chờ duyệt'}
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
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Tạo giao dịch mới</h3>
            <form onSubmit={handleTransactionSubmit} className="space-y-4">
              {/* Step 1: Customer Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bước 1: Chọn khách hàng <span className="text-red-500">*</span>
                </label>
                <select
                  value={transactionForm.customer_username}
                  onChange={handleCustomerChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-bg"
                >
                  <option value="">-- Chọn khách hàng --</option>
                  {customers.map((customer) => (
                    <option key={customer.username} value={customer.username}>
                      {customer.fullname} (@{customer.username}) - CCCD: {customer.cccd}
                    </option>
                  ))}
                </select>
              </div>

              {/* Customer Info Display */}
              {selectedCustomer && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <h4 className="font-semibold text-sm text-gray-900 mb-2">Thông tin khách hàng</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-600">Họ tên:</span>
                      <p className="font-semibold text-gray-900">{selectedCustomer.fullname}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">CCCD:</span>
                      <p className="font-semibold text-gray-900">{selectedCustomer.cccd}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Account Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bước 2: Chọn tài khoản <span className="text-red-500">*</span>
                </label>
                {loadingAccounts ? (
                  <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-center text-sm">
                    Đang tải tài khoản...
                  </div>
                ) : !transactionForm.customer_username ? (
                  <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-center text-sm">
                    Vui lòng chọn khách hàng trước
                  </div>
                ) : customerAccounts.length === 0 ? (
                  <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-yellow-50 text-yellow-700 text-center text-sm">
                    Khách hàng này chưa có tài khoản nào
                  </div>
                ) : (
                  <select
                    value={transactionForm.account_id}
                    onChange={(e) => setTransactionForm({ ...transactionForm, account_id: e.target.value })}
                    required
                    disabled={!transactionForm.customer_username}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-bg disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">-- Chọn tài khoản --</option>
                    {customerAccounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        #{account.id} - {account.account_number} - Số dư: {account.balance.toLocaleString('vi-VN')} VNĐ - {account.status === 'active' ? '✓ Hoạt động' : '✗ Khóa'}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Account Info Display */}
              {selectedAccount && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="font-semibold text-sm text-blue-900 mb-2">Thông tin tài khoản</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-blue-700">Số tài khoản:</span>
                      <p className="font-bold text-blue-900 font-mono">{selectedAccount.account_number}</p>
                    </div>
                    <div>
                      <span className="text-blue-700">Số dư hiện tại:</span>
                      <p className="font-bold text-blue-900">{selectedAccount.balance.toLocaleString('vi-VN')} VNĐ</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Transaction Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Loại giao dịch</label>
                <div className="flex gap-4">
                  <label className={`flex-1 flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    transactionForm.type === 'DEPOSIT' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      value="DEPOSIT"
                      checked={transactionForm.type === 'DEPOSIT'}
                      onChange={(e) => setTransactionForm({ ...transactionForm, type: e.target.value })}
                      className="mr-2"
                    />
                    <span className="font-semibold text-sm">NẠP TIỀN</span>
                  </label>
                  <label className={`flex-1 flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    transactionForm.type === 'WITHDRAW' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      value="WITHDRAW"
                      checked={transactionForm.type === 'WITHDRAW'}
                      onChange={(e) => setTransactionForm({ ...transactionForm, type: e.target.value })}
                      className="mr-2"
                    />
                    <span className="font-semibold text-sm">RÚT TIỀN</span>
                  </label>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Số tiền</label>
                <input
                  type="number"
                  value={transactionForm.amount}
                  onChange={(e) => setTransactionForm({ ...transactionForm, amount: e.target.value })}
                  required
                  min="1000"
                  step="1000"
                  placeholder="Nhập số tiền..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-bg"
                />
                <p className="text-xs text-gray-500 mt-1">Số tiền tối thiểu: 1,000 VNĐ</p>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateTransactionModal(false);
                    setTransactionForm({
                      customer_username: '',
                      account_id: '',
                      username: '',
                      amount: '',
                      type: 'DEPOSIT'
                    });
                    setCustomerAccounts([]);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={submitting}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting || !transactionForm.customer_username || !transactionForm.account_id}
                  className="flex-1 px-4 py-2 bg-dark-bg text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Đang xử lý...' : 'Tạo phiếu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

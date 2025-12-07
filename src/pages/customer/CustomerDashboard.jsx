import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import {
  MdMenu,
  MdNotifications,
  MdAccountBalance,
  MdTrendingUp,
  MdHistory,
  MdVisibility,
  MdVisibilityOff,
  MdArrowUpward,
  MdArrowDownward,
  MdInfo
} from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { customerAPI } from '../../services/api';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [accountsData, transactionsData] = await Promise.all([
        customerAPI.getAccounts(),
        customerAPI.getTransactions()
      ]);

      // Add account_number and account_type since API doesn't return them
      const accountsWithExtra = (accountsData.accounts || []).map(acc => ({
        ...acc,
        account_number: `ACC${String(acc.id).padStart(12, '0')}`,
        account_type: 'CHECKING'
      }));

      setAccounts(accountsWithExtra);
      setTransactions(transactionsData.transactions || []);
    } catch (err) {
      setError(err.message);
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const recentTransactions = transactions.slice(0, 5);

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
                <h1 className="text-xl font-semibold">Trang chủ</h1>
                <p className="text-sm text-gray-500">Xin chào, {user?.fullname}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <MdNotifications size={24} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
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
          {/* Info Banner */}
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <MdInfo size={24} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Hướng dẫn thực hiện giao dịch</h3>
                <p className="text-sm text-blue-800">
                  Để thực hiện <strong>nạp tiền</strong>, <strong>rút tiền</strong>, hoặc <strong>chuyển khoản</strong>,
                  vui lòng liên hệ với nhân viên ngân hàng để được hỗ trợ.
                  Bạn có thể xem lịch sử giao dịch và số dư tài khoản trong hệ thống.
                </p>
              </div>
            </div>
          </div>

          {/* Balance Card */}
          <div className="bg-gradient-to-br from-dark-bg to-gray-800 text-white rounded-2xl p-8 mb-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-gray-300 mb-2">Tổng số dư</p>
                <div className="flex items-center gap-4">
                  <h2 className="text-4xl font-bold">
                    {showBalance ? formatCurrency(totalBalance) : '••••••••'}
                  </h2>
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    {showBalance ? <MdVisibilityOff size={24} /> : <MdVisibility size={24} />}
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-300">Số tài khoản</p>
                <p className="text-lg font-semibold">{accounts.length} tài khoản</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                to="/customer/accounts"
                className="flex-1 bg-white text-dark-bg py-3 px-6 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center"
              >
                Xem tài khoản
              </Link>
              <Link
                to="/customer/transactions"
                className="flex-1 bg-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-600 transition-colors text-center"
              >
                Lịch sử GD
              </Link>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            {/* Accounts List */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MdAccountBalance size={24} className="text-dark-bg" />
                  Tài khoản của tôi
                </h3>
                <Link to="/customer/accounts" className="text-sm text-dark-bg hover:underline">
                  Xem tất cả
                </Link>
              </div>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8 text-gray-500">Đang tải...</div>
                ) : error ? (
                  <div className="text-center py-8 text-red-500">{error}</div>
                ) : accounts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">Chưa có tài khoản</div>
                ) : (
                  accounts.map((account) => (
                    <Link
                      key={account.id}
                      to={`/customer/accounts/${account.id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-dark-bg hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-700">Tài khoản #{account.id}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {account.status === 'active' ? (
                              <span className="text-green-600">● Đang hoạt động</span>
                            ) : (
                              <span className="text-red-600">● Đã khóa</span>
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-dark-bg">
                            {showBalance ? formatCurrency(account.balance) : '••••••'}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <MdArrowUpward size={24} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tiền vào tháng này</p>
                    <p className="text-lg font-bold text-green-600">+{formatCurrency(300000)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <MdArrowDownward size={24} className="text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tiền ra tháng này</p>
                    <p className="text-lg font-bold text-red-600">-{formatCurrency(50000)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MdTrendingUp size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Giao dịch chờ duyệt</p>
                    <p className="text-lg font-bold text-blue-600">1 phiếu</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MdHistory size={24} className="text-dark-bg" />
                Giao dịch gần đây
              </h3>
              <Link to="/customer/transactions" className="text-sm text-dark-bg hover:underline">
                Xem tất cả
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Ngày</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Mô tả</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Tài khoản</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Số tiền</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4 text-sm text-gray-600">{transaction.date}</td>
                      <td className="py-4 px-4 text-sm">{transaction.description}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">#{transaction.account_id}</td>
                      <td className={`py-4 px-4 text-sm text-right font-semibold ${
                        transaction.type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'DEPOSIT' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </td>
                      <td className="py-4 px-4 text-sm text-center">
                        {transaction.status === 'accepted' && (
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            Đã duyệt
                          </span>
                        )}
                        {transaction.status === 'pending' && (
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                            Chờ duyệt
                          </span>
                        )}
                        {transaction.status === 'cancel' && (
                          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                            Đã hủy
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

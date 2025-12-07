import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { MdMenu, MdNotifications, MdAccountBalance, MdInfo } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { customerAPI } from '../../services/api';

export default function CustomerAccounts() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const data = await customerAPI.getAccounts();
      // Add account_number and account_type since API doesn't return them
      const accountsWithExtra = (data.accounts || []).map(acc => ({
        ...acc,
        account_number: `ACC${String(acc.id).padStart(12, '0')}`,
        account_type: 'CHECKING'
      }));
      setAccounts(accountsWithExtra);
    } catch (err) {
      setError(err.message);
      console.error('Error loading accounts:', err);
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

  const getAccountTypeLabel = (type) => {
    const types = {
      'CHECKING': 'Tài khoản thanh toán',
      'SAVINGS': 'Tài khoản tiết kiệm',
      'CREDIT': 'Tài khoản tín dụng'
    };
    return types[type] || type;
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
                <h1 className="text-xl font-semibold">Tài khoản của tôi</h1>
                <p className="text-sm text-gray-500">Quản lý các tài khoản ngân hàng</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <MdNotifications size={24} />
              </button>
              <div className="w-10 h-10 bg-dark-bg text-white rounded-full flex items-center justify-center font-semibold">
                {user?.username?.substring(0, 2).toUpperCase()}
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
                <h3 className="font-semibold text-blue-900 mb-1">Thông báo quan trọng</h3>
                <p className="text-sm text-blue-800">
                  Để thực hiện <strong>nạp tiền</strong>, <strong>rút tiền</strong>, hoặc <strong>chuyển khoản</strong>,
                  vui lòng liên hệ với nhân viên ngân hàng để được hỗ trợ.
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-gray-500">Đang tải...</div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              Lỗi: {error}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accounts.map((account) => (
                <div key={account.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <MdAccountBalance size={24} className="text-white" />
                    </div>
                    <span className={`px-3 py-1 text-xs rounded-full ${
                      account.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {account.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">{getAccountTypeLabel(account.account_type)}</p>
                    <p className="text-2xl font-bold text-dark-bg">{formatCurrency(account.balance)}</p>
                  </div>

                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Số tài khoản</p>
                    <p className="font-mono text-sm font-semibold">{account.account_number}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && accounts.length === 0 && (
            <div className="text-center py-12">
              <MdAccountBalance size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">Bạn chưa có tài khoản nào</p>
              <p className="text-sm text-gray-400">Liên hệ với nhân viên ngân hàng để mở tài khoản mới</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { MdMenu, MdSearch, MdAdd, MdAccountBalance, MdLock, MdLockOpen } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { staffAPI } from '../../services/api';

export default function StaffAccounts() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const data = await staffAPI.getAccounts();
      setAccounts(data.accounts || []);
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
      'CHECKING': 'Thanh toán',
      'SAVINGS': 'Tiết kiệm',
      'CREDIT': 'Tín dụng'
    };
    return types[type] || type;
  };

  const filteredAccounts = accounts.filter(account =>
    account.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.account_number?.includes(searchTerm)
  );

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
                <h1 className="text-xl font-semibold">Quản lý tài khoản</h1>
                <p className="text-sm text-gray-500">Danh sách tất cả tài khoản ngân hàng</p>
              </div>
            </div>
            <Link
              to="/staff/accounts/new"
              className="flex items-center gap-2 px-4 py-2 bg-dark-bg text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <MdAdd size={20} />
              Mở tài khoản mới
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, username, số tài khoản..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-bg"
              />
            </div>
          </div>

          {/* Accounts List */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-gray-500">Đang tải...</div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              Lỗi: {error}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Chủ tài khoản
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số tài khoản
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Loại TK
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số dư
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredAccounts.map((account) => (
                      <tr key={account.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700">
                          #{account.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="font-semibold text-gray-900">{account.fullname}</p>
                            <p className="text-xs text-gray-500">@{account.username}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                          {account.account_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {getAccountTypeLabel(account.account_type)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(account.balance)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full ${
                            account.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {account.status === 'active' ? (
                              <>
                                <MdLockOpen size={14} /> Hoạt động
                              </>
                            ) : (
                              <>
                                <MdLock size={14} /> Đã khóa
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <Link
                            to={`/staff/accounts/${account.id}`}
                            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                          >
                            Chi tiết
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredAccounts.length === 0 && (
                <div className="text-center py-12">
                  <MdAccountBalance size={64} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Không tìm thấy tài khoản nào</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

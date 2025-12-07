import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { MdMenu, MdSearch, MdAccountBalance, MdLock, MdLockOpen, MdTrendingUp } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { staffAPI, directorAPI } from '../../services/api';

export default function DirectorAccounts() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const data = await directorAPI.getAccounts();
      setAccounts(data.accounts || []);
    } catch (err) {
      setError(err.message);
      console.error('Error loading accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLockUnlock = async (accountId, currentStatus) => {
    const action = currentStatus === 'active' ? 'lock' : 'unlock';
    const confirmMsg = currentStatus === 'active'
      ? 'Bạn có chắc muốn khóa tài khoản này?'
      : 'Bạn có chắc muốn mở khóa tài khoản này?';

    if (confirm(confirmMsg)) {
      try {
        if (action === 'lock') {
          await directorAPI.lockAccount(accountId);
          showToast('Đã khóa tài khoản', 'success');
        } else {
          await directorAPI.unlockAccount(accountId);
          showToast('Đã mở khóa tài khoản', 'success');
        }
        loadAccounts();
      } catch (err) {
        showToast('Lỗi: ' + err.message, 'error');
      }
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

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch =
      account.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.account_number?.includes(searchTerm);

    const matchesFilter = filterStatus === 'ALL' || account.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: accounts.length,
    active: accounts.filter(a => a.status === 'active').length,
    locked: accounts.filter(a => a.status !== 'active').length,
    totalBalance: accounts.reduce((sum, a) => sum + (a.balance || 0), 0)
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
              <h1 className="text-xl font-semibold">Quản lý tài khoản</h1>
              <p className="text-sm text-gray-500">Tổng quan tất cả tài khoản trong hệ thống</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <MdAccountBalance size={32} className="opacity-80" />
                <MdTrendingUp size={24} className="opacity-60" />
              </div>
              <p className="text-sm opacity-90 mb-1">Tổng tài khoản</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <MdLockOpen size={32} className="opacity-80" />
              </div>
              <p className="text-sm opacity-90 mb-1">Đang hoạt động</p>
              <p className="text-3xl font-bold">{stats.active}</p>
            </div>

            <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <MdLock size={32} className="opacity-80" />
              </div>
              <p className="text-sm opacity-90 mb-1">Đã khóa</p>
              <p className="text-3xl font-bold">{stats.locked}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <MdAccountBalance size={32} className="opacity-80" />
              </div>
              <p className="text-sm opacity-90 mb-1">Tổng số dư</p>
              <p className="text-2xl font-bold">{formatCurrency(stats.totalBalance)}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, username, số tài khoản..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-bg"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-bg"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="locked">Đã khóa</option>
            </select>
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
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            {getAccountTypeLabel(account.account_type)}
                          </span>
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
                          <button
                            onClick={() => handleLockUnlock(account.id, account.status)}
                            className={`inline-flex items-center gap-1 px-3 py-1 text-sm rounded transition-colors ${
                              account.status === 'active'
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {account.status === 'active' ? (
                              <>
                                <MdLock size={16} /> Khóa
                              </>
                            ) : (
                              <>
                                <MdLockOpen size={16} /> Mở khóa
                              </>
                            )}
                          </button>
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

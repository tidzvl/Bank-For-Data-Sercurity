import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { MdMenu, MdNotifications, MdSearch, MdFilterList, MdFileDownload, MdInfo } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { customerAPI } from '../../services/api';

export default function CustomerTransactions() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await customerAPI.getTransactions();
      setTransactions(data.transactions || []);
    } catch (err) {
      setError(err.message);
      console.error('Error loading transactions:', err);
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

  const getTransactionTypeLabel = (type) => {
    const types = {
      'DEPOSIT': 'Nạp tiền',
      'WITHDRAW': 'Rút tiền',
      'TRANSFER': 'Chuyển khoản',
      'RECEIVE': 'Nhận tiền'
    };
    return types[type] || type;
  };

  const getStatusLabel = (status) => {
    const statuses = {
      'pending': 'Chờ duyệt',
      'accepted': 'Đã duyệt',
      'cancel': 'Đã hủy'
    };
    return statuses[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-700',
      'accepted': 'bg-green-100 text-green-700',
      'cancel': 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.account_id?.toString().includes(searchTerm) ||
                         t.id?.toString().includes(searchTerm);
    const matchesFilter = filterType === 'ALL' || t.type === filterType;
    return matchesSearch && matchesFilter;
  });

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
                <h1 className="text-xl font-semibold">Lịch sử giao dịch</h1>
                <p className="text-sm text-gray-500">Xem tất cả giao dịch của bạn</p>
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
                <h3 className="font-semibold text-blue-900 mb-1">Lưu ý</h3>
                <p className="text-sm text-blue-800">
                  Đây là lịch sử các giao dịch đã được nhân viên tạo và giám đốc duyệt.
                  Để thực hiện giao dịch mới, vui lòng liên hệ với nhân viên ngân hàng.
                </p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Tìm kiếm giao dịch..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-bg"
                />
              </div>

              {/* Filter by type */}
              <div className="flex items-center gap-2">
                <MdFilterList size={20} className="text-gray-500" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-bg"
                >
                  <option value="ALL">Tất cả</option>
                  <option value="DEPOSIT">Nạp tiền</option>
                  <option value="WITHDRAW">Rút tiền</option>
                  <option value="TRANSFER">Chuyển khoản</option>
                  <option value="RECEIVE">Nhận tiền</option>
                </select>
              </div>

              {/* Export button */}
              <button className="flex items-center gap-2 px-4 py-2 bg-dark-bg text-white rounded-lg hover:bg-gray-800 transition-colors">
                <MdFileDownload size={20} />
                <span>Xuất file</span>
              </button>
            </div>
          </div>

          {/* Transactions List */}
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
                        Ngày giờ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Loại GD
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tài khoản
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mô tả
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số tiền
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.req_date ? new Date(transaction.req_date).toLocaleString('vi-VN') : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {getTransactionTypeLabel(transaction.type)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                          TK #{transaction.account_id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {transaction.type === 'DEPOSIT' ? 'Nạp tiền vào tài khoản' : 'Rút tiền từ tài khoản'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                          <span className={`font-semibold ${
                            transaction.type === 'DEPOSIT'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}>
                            {transaction.type === 'DEPOSIT' ? '+' : '-'}
                            {formatCurrency(transaction.amount)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(transaction.status)}`}>
                            {getStatusLabel(transaction.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredTransactions.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">Không có giao dịch nào</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

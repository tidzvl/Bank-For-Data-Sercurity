import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { MdMenu, MdSearch, MdPerson, MdAccountBalance, MdTrendingUp, MdEmail, MdPhone } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { directorAPI } from '../../services/api';

export default function DirectorCustomers() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await directorAPI.getCustomers();
      setCustomers(data.customers || []);
    } catch (err) {
      setError(err.message);
      console.error('Error loading customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.cccd?.includes(searchTerm) ||
    customer.phone?.includes(searchTerm) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: customers.length,
    withAccounts: customers.filter(c => c.accountCount > 0).length,
    withoutAccounts: customers.filter(c => !c.accountCount || c.accountCount === 0).length,
    totalAccounts: customers.reduce((sum, c) => sum + (c.accountCount || 0), 0)
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
              <h1 className="text-xl font-semibold">Quản lý khách hàng</h1>
              <p className="text-sm text-gray-500">Xem danh sách và thống kê khách hàng</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <MdPerson size={32} className="opacity-80" />
                <MdTrendingUp size={24} className="opacity-60" />
              </div>
              <p className="text-sm opacity-90 mb-1">Tổng khách hàng</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <MdAccountBalance size={32} className="opacity-80" />
              </div>
              <p className="text-sm opacity-90 mb-1">Có tài khoản</p>
              <p className="text-3xl font-bold">{stats.withAccounts}</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <MdPerson size={32} className="opacity-80" />
              </div>
              <p className="text-sm opacity-90 mb-1">Chưa có TK</p>
              <p className="text-3xl font-bold">{stats.withoutAccounts}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <MdAccountBalance size={32} className="opacity-80" />
              </div>
              <p className="text-sm opacity-90 mb-1">Tổng số TK</p>
              <p className="text-3xl font-bold">{stats.totalAccounts}</p>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, username, CCCD, SĐT, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-bg"
              />
            </div>
          </div>

          {/* Customers List */}
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
              {filteredCustomers.map((customer) => (
                <div key={customer.username} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">
                      {customer.username.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1 truncate">{customer.fullname}</h3>
                      <p className="text-sm text-gray-500 mb-2">@{customer.username}</p>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {customer.accountCount || 0} tài khoản
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <div className="flex items-start gap-2">
                      <MdPerson size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500">CCCD</p>
                        <p className="text-sm font-mono truncate">{customer.cccd || '-'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <MdPhone size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500">Số điện thoại</p>
                        <p className="text-sm truncate">{customer.phone || '-'}</p>
                      </div>
                    </div>

                    {customer.email && (
                      <div className="flex items-start gap-2">
                        <MdEmail size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="text-sm truncate">{customer.email}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <MdPerson size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Không tìm thấy khách hàng nào</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

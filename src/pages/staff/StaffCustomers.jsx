import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { MdMenu, MdSearch, MdAdd, MdPerson } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { staffAPI } from '../../services/api';

export default function StaffCustomers() {
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
      const data = await staffAPI.getCustomers();
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
    customer.phone?.includes(searchTerm)
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
                <h1 className="text-xl font-semibold">Quản lý khách hàng</h1>
                <p className="text-sm text-gray-500">Danh sách tất cả khách hàng</p>
              </div>
            </div>
            <Link
              to="/staff/customers/new"
              className="flex items-center gap-2 px-4 py-2 bg-dark-bg text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <MdAdd size={20} />
              Thêm khách hàng
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
                placeholder="Tìm kiếm theo tên, username, CCCD, SĐT..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-bg"
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Khách hàng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Username
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        CCCD
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số điện thoại
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số TK
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredCustomers.map((customer) => (
                      <tr key={customer.username} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-dark-bg text-white rounded-full flex items-center justify-center font-semibold">
                              {customer.username.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{customer.fullname}</p>
                              <p className="text-xs text-gray-500">{customer.email || '-'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          @{customer.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                          {customer.cccd || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {customer.phone || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">
                            {customer.accountCount || 0} TK
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-2">
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredCustomers.length === 0 && (
                <div className="text-center py-12">
                  <MdPerson size={64} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Không tìm thấy khách hàng nào</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

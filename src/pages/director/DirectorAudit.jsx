import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { MdMenu, MdSearch, MdDescription, MdFilterList, MdFileDownload } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { directorAPI } from '../../services/api';

export default function DirectorAudit() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      const data = await directorAPI.getAuditTrail({ limit: 100 });
      setAuditLogs(data.logs || []);
    } catch (err) {
      setError(err.message);
      console.error('Error loading audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch =
      log.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.object?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterAction === 'ALL' || log.action === filterAction;

    return matchesSearch && matchesFilter;
  });

  const actionTypes = [...new Set(auditLogs.map(log => log.action))];

  const getActionColor = (action) => {
    const colors = {
      'CREATE': 'bg-green-100 text-green-700',
      'UPDATE': 'bg-blue-100 text-blue-700',
      'DELETE': 'bg-red-100 text-red-700',
      'APPROVE': 'bg-purple-100 text-purple-700',
      'REJECT': 'bg-yellow-100 text-yellow-700',
      'LOGIN': 'bg-gray-100 text-gray-700',
      'LOGOUT': 'bg-gray-100 text-gray-700'
    };
    return colors[action] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
                <MdMenu size={24} />
              </button>
              <div>
                <h1 className="text-xl font-semibold">Audit Trail</h1>
                <p className="text-sm text-gray-500">Lịch sử hoạt động hệ thống</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-dark-bg text-white rounded-lg hover:bg-gray-800 transition-colors">
              <MdFileDownload size={20} />
              Xuất báo cáo
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm theo user, hành động, đối tượng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-bg"
              />
            </div>

            <div className="flex items-center gap-2">
              <MdFilterList size={20} className="text-gray-500" />
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-bg"
              >
                <option value="ALL">Tất cả hành động</option>
                {actionTypes.map(action => (
                  <option key={action} value={action}>{action}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Audit Logs */}
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
                        Thời gian
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Người dùng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hành động
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Đối tượng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Chi tiết
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        IP Address
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredLogs.map((log, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {log.time || log.timestamp || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                              {log.user?.substring(0, 2).toUpperCase() || '??'}
                            </div>
                            <span className="font-medium text-gray-900">{log.user || 'Unknown'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 text-xs rounded-full font-medium ${getActionColor(log.action)}`}>
                            {log.action || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                          {log.object || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate">
                          {log.details || log.description || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                          {log.ip_address || log.ip || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredLogs.length === 0 && (
                <div className="text-center py-12">
                  <MdDescription size={64} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Không có log nào</p>
                </div>
              )}
            </div>
          )}

          {/* Summary Stats */}
          {!loading && !error && filteredLogs.length > 0 && (
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Thống kê</h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Tổng số log</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredLogs.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Người dùng</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {[...new Set(filteredLogs.map(l => l.user))].length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Loại hành động</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {[...new Set(filteredLogs.map(l => l.action))].length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">IP khác nhau</p>
                  <p className="text-2xl font-bold text-green-600">
                    {[...new Set(filteredLogs.map(l => l.ip_address || l.ip).filter(Boolean))].length}
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

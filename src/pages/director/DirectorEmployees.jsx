import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { MdMenu, MdSearch, MdPerson, MdSupervisorAccount, MdEdit, MdLock, MdLockOpen } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { directorAPI } from '../../services/api';

export default function DirectorEmployees() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await directorAPI.getEmployees();
      setEmployees(data.employees || []);
    } catch (err) {
      setError(err.message);
      console.error('Error loading employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setEditForm({
      salary: employee.salary,
      position: employee.position
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      await directorAPI.updateEmployee(selectedEmployee.username, editForm);
      showToast('Cập nhật nhân viên thành công', 'success');
      setShowEditModal(false);
      loadEmployees();
    } catch (err) {
      showToast('Lỗi: ' + err.message, 'error');
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: employees.length,
    active: employees.filter(e => e.status === 'active').length,
    inactive: employees.filter(e => e.status !== 'active').length,
    staff: employees.filter(e => e.role === 'STAFF').length
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
              <h1 className="text-xl font-semibold">Quản lý nhân viên</h1>
              <p className="text-sm text-gray-500">Danh sách nhân viên và phân quyền</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <MdSupervisorAccount size={32} className="opacity-80" />
              </div>
              <p className="text-sm opacity-90 mb-1">Tổng nhân viên</p>
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
              <p className="text-3xl font-bold">{stats.inactive}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <MdPerson size={32} className="opacity-80" />
              </div>
              <p className="text-sm opacity-90 mb-1">Nhân viên</p>
              <p className="text-3xl font-bold">{stats.staff}</p>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, username, chức vụ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-bg"
              />
            </div>
          </div>

          {/* Employees List */}
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
                        Username
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Chức vụ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lương
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
                    {filteredEmployees.map((emp) => (
                      <tr key={emp.username} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center font-semibold">
                              {emp.username.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">@{emp.username}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {emp.position || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {emp.salary ? emp.salary.toLocaleString('vi-VN') + ' VNĐ' : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full ${
                            emp.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {emp.status === 'active' ? (
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
                            onClick={() => handleEdit(emp)}
                            className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                          >
                            <MdEdit size={16} />
                            Sửa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredEmployees.length === 0 && (
                <div className="text-center py-12">
                  <MdPerson size={64} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Không tìm thấy nhân viên nào</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Chỉnh sửa nhân viên</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  value={selectedEmployee.username}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                <input
                  type="text"
                  value={editForm.fullname}
                  onChange={(e) => setEditForm({...editForm, fullname: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-bg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chức vụ</label>
                <input
                  type="text"
                  value={editForm.position}
                  onChange={(e) => setEditForm({...editForm, position: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-bg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-bg"
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Đã khóa</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-4 py-2 bg-dark-bg text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

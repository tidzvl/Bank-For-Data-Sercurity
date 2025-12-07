import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { MdMenu, MdPerson, MdSecurity, MdNotifications, MdLanguage, MdPalette, MdLock } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Settings() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('account');
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const tabs = [
    { id: 'account', label: 'Tài khoản', icon: MdPerson },
    { id: 'security', label: 'Bảo mật', icon: MdSecurity },
    { id: 'notifications', label: 'Thông báo', icon: MdNotifications },
    { id: 'appearance', label: 'Giao diện', icon: MdPalette }
  ];

  const handlePasswordChange = (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      showToast('Mật khẩu xác nhận không khớp', 'error');
      return;
    }

    if (formData.newPassword.length < 6) {
      showToast('Mật khẩu phải có ít nhất 6 ký tự', 'error');
      return;
    }

    // In a real app, call API to change password
    showToast('Đổi mật khẩu thành công', 'success');
    setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
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
              <h1 className="text-xl font-semibold">Cài đặt</h1>
              <p className="text-sm text-gray-500">Cấu hình tài khoản và hệ thống</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-5xl mx-auto">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
              <div className="flex border-b border-gray-200 overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'text-dark-bg border-b-2 border-dark-bg'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Icon size={20} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              {/* Account Tab */}
              {activeTab === 'account' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-4">Thông tin tài khoản</h2>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                          {user?.username?.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-lg">{user?.fullname}</p>
                          <p className="text-sm text-gray-500">@{user?.username}</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Tên đăng nhập</label>
                          <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">{user?.username}</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Vai trò</label>
                          <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                            {user?.role === 'CUSTOMER' && 'Khách hàng'}
                            {user?.role === 'STAFF' && 'Nhân viên'}
                            {user?.role === 'DIRECTOR' && 'Giám đốc'}
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                          <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">{user?.fullname}</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                          <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">{user?.email || 'Chưa cập nhật'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <MdLock size={24} />
                      Đổi mật khẩu
                    </h2>
                    <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mật khẩu hiện tại
                        </label>
                        <input
                          type="password"
                          value={formData.currentPassword}
                          onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-bg"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mật khẩu mới
                        </label>
                        <input
                          type="password"
                          value={formData.newPassword}
                          onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-bg"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Xác nhận mật khẩu mới
                        </label>
                        <input
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-bg"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="px-6 py-2 bg-dark-bg text-white rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        Đổi mật khẩu
                      </button>
                    </form>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Phiên đăng nhập</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Đăng xuất khỏi tất cả các thiết bị khác đang sử dụng tài khoản này.
                    </p>
                    <button
                      onClick={() => showToast('Tính năng đang phát triển', 'info')}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Đăng xuất tất cả thiết bị
                    </button>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold mb-4">Cài đặt thông báo</h2>
                  <div className="space-y-4">
                    {[
                      { id: 'email', label: 'Thông báo qua Email', description: 'Nhận email về các giao dịch quan trọng' },
                      { id: 'push', label: 'Thông báo đẩy', description: 'Nhận thông báo trực tiếp trên trình duyệt' },
                      { id: 'transaction', label: 'Thông báo giao dịch', description: 'Nhận thông báo khi có giao dịch mới' },
                      { id: 'security', label: 'Cảnh báo bảo mật', description: 'Nhận cảnh báo về hoạt động đáng ngờ' }
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{item.label}</p>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-dark-bg"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold mb-4">Giao diện</h2>

                  <div>
                    <h3 className="font-medium mb-3">Chế độ hiển thị</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { id: 'light', label: 'Sáng', icon: '☀️' },
                        { id: 'dark', label: 'Tối', icon: '🌙' },
                        { id: 'auto', label: 'Tự động', icon: '⚙️' }
                      ].map((theme) => (
                        <button
                          key={theme.id}
                          className="p-4 border-2 border-gray-300 rounded-lg hover:border-dark-bg transition-colors"
                        >
                          <div className="text-3xl mb-2">{theme.icon}</div>
                          <p className="font-medium">{theme.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Ngôn ngữ</h3>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-bg">
                      <option value="vi">Tiếng Việt</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      Các tính năng giao diện đang được phát triển...
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

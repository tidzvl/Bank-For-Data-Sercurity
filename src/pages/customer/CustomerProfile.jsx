import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { MdMenu, MdNotifications, MdEdit, MdSave, MdCancel } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { customerAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function CustomerProfile() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await customerAPI.getProfile();
      setProfile(data.profile || data);
      setEditedProfile(data.profile || data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile({ ...profile });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile({ ...profile });
  };

  const handleSave = async () => {
    try {
      await customerAPI.updateProfile(editedProfile);
      setProfile(editedProfile);
      setIsEditing(false);
      showToast('Cập nhật thông tin thành công', 'success');
    } catch (err) {
      showToast('Lỗi: ' + err.message, 'error');
      console.error('Error updating profile:', err);
    }
  };

  const handleChange = (field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
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
                <h1 className="text-xl font-semibold">Hồ sơ cá nhân</h1>
                <p className="text-sm text-gray-500">Quản lý thông tin cá nhân</p>
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
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-gray-500">Đang tải...</div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              Lỗi: {error}
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-white text-dark-bg rounded-full flex items-center justify-center text-3xl font-bold">
                      {user?.username?.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-1">{profile?.fullname}</h2>
                      <p className="text-blue-100">@{profile?.username}</p>
                    </div>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Thông tin cá nhân</h3>
                    {!isEditing ? (
                      <button
                        onClick={handleEdit}
                        className="flex items-center gap-2 px-4 py-2 bg-dark-bg text-white rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        <MdEdit size={18} />
                        <span>Chỉnh sửa</span>
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={handleCancel}
                          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <MdCancel size={18} />
                          <span>Hủy</span>
                        </button>
                        <button
                          onClick={handleSave}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <MdSave size={18} />
                          <span>Lưu</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedProfile.fullname || ''}
                          onChange={(e) => handleChange('fullname', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-bg"
                        />
                      ) : (
                        <p className="text-gray-900 py-2">{profile?.fullname}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tên đăng nhập</label>
                      <p className="text-gray-900 py-2">{profile?.username}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CCCD/CMND</label>
                      <p className="text-gray-900 py-2">{profile?.cccd || '-'}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editedProfile.phone || ''}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-bg"
                        />
                      ) : (
                        <p className="text-gray-900 py-2">{profile?.phone || '-'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editedProfile.email || ''}
                          onChange={(e) => handleChange('email', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-bg"
                        />
                      ) : (
                        <p className="text-gray-900 py-2">{profile?.email || '-'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ngày sinh</label>
                      {isEditing ? (
                        <input
                          type="date"
                          value={editedProfile.dob || ''}
                          onChange={(e) => handleChange('dob', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-bg"
                        />
                      ) : (
                        <p className="text-gray-900 py-2">
                          {profile?.dob ? new Date(profile.dob).toLocaleDateString('vi-VN') : '-'}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                      {isEditing ? (
                        <textarea
                          value={editedProfile.address || ''}
                          onChange={(e) => handleChange('address', e.target.value)}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-bg"
                        />
                      ) : (
                        <p className="text-gray-900 py-2">{profile?.address || '-'}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

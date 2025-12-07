import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { MdMenu, MdSave, MdCancel } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { staffAPI } from '../../services/api';

export default function StaffAccountNew() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    username: searchParams.get('customer') || '',
    account_type: 'CHECKING',
    initial_balance: '0'
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await staffAPI.getCustomers();
      setCustomers(data.customers || []);
    } catch (err) {
      console.error('Error loading customers:', err);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await staffAPI.createAccount({
        username: formData.username,
        account_type: formData.account_type,
        initial_balance: parseFloat(formData.initial_balance)
      });
      showToast('Mở tài khoản thành công', 'success');
      navigate('/staff/accounts');
    } catch (err) {
      showToast('Lỗi: ' + err.message, 'error');
      console.error('Error creating account:', err);
    } finally {
      setLoading(false);
    }
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
                <h1 className="text-xl font-semibold">Mở tài khoản mới</h1>
                <p className="text-sm text-gray-500">Tạo tài khoản ngân hàng cho khách hàng</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn khách hàng <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.username}
                    onChange={(e) => handleChange('username', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-bg"
                  >
                    <option value="">-- Chọn khách hàng --</option>
                    {customers.map((customer) => (
                      <option key={customer.username} value={customer.username}>
                        {customer.fullname} (@{customer.username}) - {customer.cccd}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại tài khoản <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.account_type === 'CHECKING'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        value="CHECKING"
                        checked={formData.account_type === 'CHECKING'}
                        onChange={(e) => handleChange('account_type', e.target.value)}
                        className="mr-3"
                      />
                      <div>
                        <p className="font-semibold">Tài khoản thanh toán</p>
                        <p className="text-xs text-gray-500">Dùng cho giao dịch hàng ngày</p>
                      </div>
                    </label>

                    <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.account_type === 'SAVINGS'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        value="SAVINGS"
                        checked={formData.account_type === 'SAVINGS'}
                        onChange={(e) => handleChange('account_type', e.target.value)}
                        className="mr-3"
                      />
                      <div>
                        <p className="font-semibold">Tài khoản tiết kiệm</p>
                        <p className="text-xs text-gray-500">Có lãi suất, hạn chế giao dịch</p>
                      </div>
                    </label>

                    <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.account_type === 'CREDIT'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        value="CREDIT"
                        checked={formData.account_type === 'CREDIT'}
                        onChange={(e) => handleChange('account_type', e.target.value)}
                        className="mr-3"
                      />
                      <div>
                        <p className="font-semibold">Tài khoản tín dụng</p>
                        <p className="text-xs text-gray-500">Cho vay, thấu chi</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số dư ban đầu
                  </label>
                  <input
                    type="number"
                    value={formData.initial_balance}
                    onChange={(e) => handleChange('initial_balance', e.target.value)}
                    min="0"
                    step="1000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-bg"
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Để trống hoặc nhập 0 nếu không có số dư ban đầu
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/staff/accounts')}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <MdCancel size={20} />
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-dark-bg text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <MdSave size={20} />
                    {loading ? 'Đang mở...' : 'Mở tài khoản'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

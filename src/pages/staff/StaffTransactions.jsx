import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { MdMenu, MdAdd, MdWarning } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function StaffTransactions() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [customerAccounts, setCustomerAccounts] = useState([]);
  const [formData, setFormData] = useState({
    customer_username: '',
    account_id: '',
    username: '',
    amount: '',
    type: 'DEPOSIT'
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const response = await axios.get(`${API_URL}/staff/customers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCustomers(response.data.customers || []);
    } catch (err) {
      console.error('Error loading customers:', err);
    }
  };

  const loadCustomerAccounts = async (username) => {
    if (!username) {
      setCustomerAccounts([]);
      return;
    }

    try {
      setLoadingAccounts(true);
      const response = await axios.get(`${API_URL}/staff/customers/${username}/accounts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCustomerAccounts(response.data.accounts || []);
    } catch (err) {
      console.error('Error loading customer accounts:', err);
      showToast('Không thể tải tài khoản của khách hàng', 'error');
      setCustomerAccounts([]);
    } finally {
      setLoadingAccounts(false);
    }
  };

  const handleCustomerChange = (e) => {
    const username = e.target.value;
    setFormData({
      ...formData,
      customer_username: username,
      account_id: '',
      username: username
    });

    // Load accounts for selected customer
    if (username) {
      loadCustomerAccounts(username);
    } else {
      setCustomerAccounts([]);
    }
  };

  const handleAccountChange = (e) => {
    const accountId = e.target.value;
    setFormData({ ...formData, account_id: accountId });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/staff/transactions`,
        {
          account_id: parseInt(formData.account_id),
          username: formData.username,
          amount: parseFloat(formData.amount),
          type: formData.type
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      showToast(
        response.data.message,
        'success'
      );

      // Reset form
      setFormData({
        customer_username: '',
        account_id: '',
        username: '',
        amount: '',
        type: 'DEPOSIT'
      });
      setCustomerAccounts([]);

    } catch (err) {
      const errorData = err.response?.data;

      if (errorData?.trigger_info) {
        // Trigger chặn giao dịch - hiển thị thông tin trigger
        showToast(
          errorData.error,
          'error',
          errorData.trigger_info,
          8000 // 8 seconds for trigger errors
        );
      } else {
        showToast(
          errorData?.error || 'Không thể tạo giao dịch',
          'error'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const selectedCustomer = customers.find(c => c.username === formData.customer_username);
  const selectedAccount = customerAccounts.find(acc => acc.id === parseInt(formData.account_id));

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
                <h1 className="text-xl font-semibold">Tạo giao dịch</h1>
                <p className="text-sm text-gray-500">Tạo phiếu nạp/rút tiền cho khách hàng</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            {/* Warning Banner - Demo Trigger */}
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <MdWarning className="text-yellow-600 flex-shrink-0 mt-0.5" size={24} />
                <div>
                  <h3 className="font-semibold text-yellow-900 mb-1">
                    🔥 DEMO TRIGGER: trg_check_withdraw
                  </h3>
                  <p className="text-sm text-yellow-800 mb-2">
                    Khi tạo giao dịch RÚT TIỀN với số tiền lớn hơn số dư, trigger sẽ tự động chặn và hiển thị thông báo lỗi.
                  </p>
                  <div className="text-xs text-yellow-700 bg-yellow-100 rounded p-2 font-mono">
                    <strong>Trigger Type:</strong> BEFORE INSERT ON transaction_log<br />
                    <strong>Action:</strong> Kiểm tra số dư trước khi insert<br />
                    <strong>Error Code:</strong> ORA-20001 nếu số dư không đủ
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Customer Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bước 1: Chọn khách hàng <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.customer_username}
                    onChange={handleCustomerChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-bg focus:border-transparent"
                  >
                    <option value="">-- Chọn khách hàng --</option>
                    {customers.map((customer) => (
                      <option key={customer.username} value={customer.username}>
                        {customer.fullname} (@{customer.username}) - CCCD: {customer.cccd}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Customer Info Display */}
                {selectedCustomer && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Thông tin khách hàng</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Họ tên:</span>
                        <p className="font-semibold text-gray-900">{selectedCustomer.fullname}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">CCCD:</span>
                        <p className="font-semibold text-gray-900">{selectedCustomer.cccd}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Số điện thoại:</span>
                        <p className="font-semibold text-gray-900">{selectedCustomer.phone || '-'}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Số tài khoản:</span>
                        <p className="font-semibold text-gray-900">{selectedCustomer.accountCount || 0} tài khoản</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Account Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bước 2: Chọn tài khoản <span className="text-red-500">*</span>
                  </label>
                  {loadingAccounts ? (
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-center">
                      Đang tải tài khoản...
                    </div>
                  ) : !formData.customer_username ? (
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-center">
                      Vui lòng chọn khách hàng trước
                    </div>
                  ) : customerAccounts.length === 0 ? (
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-yellow-50 text-yellow-700 text-center">
                      Khách hàng này chưa có tài khoản nào
                    </div>
                  ) : (
                    <select
                      value={formData.account_id}
                      onChange={handleAccountChange}
                      required
                      disabled={!formData.customer_username}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-bg focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">-- Chọn tài khoản --</option>
                      {customerAccounts.map((account) => (
                        <option key={account.id} value={account.id}>
                          #{account.id} - {account.account_number} -
                          Số dư: {account.balance.toLocaleString('vi-VN')} VNĐ -
                          {account.status === 'active' ? ' ✓ Hoạt động' : ' ✗ Khóa'}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Account Info Display */}
                {selectedAccount && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Thông tin tài khoản</h4>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <span className="text-blue-700">Số tài khoản:</span>
                        <p className="font-bold text-blue-900 font-mono">{selectedAccount.account_number}</p>
                      </div>
                      <div>
                        <span className="text-blue-700">Số dư hiện tại:</span>
                        <p className="font-bold text-blue-900 text-lg">
                          {selectedAccount.balance.toLocaleString('vi-VN')} VNĐ
                        </p>
                      </div>
                      <div>
                        <span className="text-blue-700">Trạng thái:</span>
                        <p className="font-semibold">
                          {selectedAccount.status === 'active' ? (
                            <span className="text-green-600">● Đang hoạt động</span>
                          ) : (
                            <span className="text-red-600">● Đã khóa</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Transaction Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại giao dịch
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.type === 'DEPOSIT'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        value="DEPOSIT"
                        checked={formData.type === 'DEPOSIT'}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="mr-2"
                      />
                      <span className="font-semibold">NẠP TIỀN</span>
                    </label>
                    <label className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.type === 'WITHDRAW'
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        value="WITHDRAW"
                        checked={formData.type === 'WITHDRAW'}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="mr-2"
                      />
                      <span className="font-semibold">RÚT TIỀN 🔥</span>
                    </label>
                  </div>
                  {formData.type === 'WITHDRAW' && (
                    <p className="text-xs text-red-600 mt-2">
                      ⚠️ Trigger sẽ chặn nếu số tiền rút lớn hơn số dư!
                    </p>
                  )}
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số tiền
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                    min="1000"
                    step="1000"
                    placeholder="Nhập số tiền..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-bg focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Số tiền tối thiểu: 1,000 VNĐ
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !formData.customer_username || !formData.account_id}
                  className="w-full bg-dark-bg text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    'Đang xử lý...'
                  ) : (
                    <>
                      <MdAdd size={20} />
                      Tạo phiếu giao dịch
                    </>
                  )}
                </button>
              </form>

              {/* Demo Instructions */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">💡 Hướng dẫn demo Trigger</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                  <li>Chọn khách hàng từ danh sách</li>
                  <li>Chọn một tài khoản có số dư (ví dụ: 500,000 VNĐ)</li>
                  <li>Chọn loại giao dịch: <strong>RÚT TIỀN</strong></li>
                  <li>Nhập số tiền <strong>LỚN HƠN số dư</strong> (ví dụ: 1,000,000 VNĐ)</li>
                  <li>Click "Tạo phiếu giao dịch"</li>
                  <li>Trigger <code className="bg-gray-200 px-1 rounded">trg_check_withdraw</code> sẽ chặn và hiển thị thông báo lỗi</li>
                </ol>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

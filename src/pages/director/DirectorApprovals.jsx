import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { MdMenu, MdCheckCircle, MdCancel, MdAssignment } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { directorAPI } from '../../services/api';
import Swal from 'sweetalert2';

export default function DirectorApprovals() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await directorAPI.getPendingApprovals();
      setTransactions(data.transactions || []);
    } catch (err) {
      setError(err.message);
      console.error('Error loading transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return '0 ₫';
    }
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleApprove = async (transactionId, transaction) => {
    const result = await Swal.fire({
      title: 'Xác nhận duyệt phiếu',
      html: `
        <div class="text-left">
          <p class="mb-2"><strong>Giao dịch:</strong> ${transaction.type === 'DEPOSIT' ? 'NẠP TIỀN' : 'RÚT TIỀN'}</p>
          <p class="mb-2"><strong>Số tiền:</strong> ${formatCurrency(transaction.amount)}</p>
          <p class="mb-2"><strong>Khách hàng:</strong> ${transaction.fullname}</p>
          <p class="mb-2"><strong>Tài khoản:</strong> #${transaction.account_id}</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#dc2626',
      confirmButtonText: 'Duyệt',
      cancelButtonText: 'Hủy'
    });

    if (result.isConfirmed) {
      try {
        const response = await directorAPI.approveTransaction(transactionId);

        // Show trigger info if available
        if (response.trigger_info) {
          await Swal.fire({
            title: '✅ Duyệt thành công!',
            html: `
              <div class="text-left">
                <p class="mb-3 text-green-600 font-semibold">${response.message}</p>
                <div class="bg-blue-50 p-3 rounded-lg mb-3">
                  <p class="text-sm font-semibold text-blue-900 mb-2">Thông tin Trigger:</p>
                  <p class="text-xs text-blue-800 mb-1"><strong>Tên:</strong> ${response.trigger_info.name}</p>
                  <p class="text-xs text-blue-800 mb-1"><strong>Loại:</strong> ${response.trigger_info.type}</p>
                  <p class="text-xs text-blue-800">${response.trigger_info.description}</p>
                </div>
                <div class="bg-gray-50 p-3 rounded-lg">
                  <p class="text-sm font-semibold mb-2">Chi tiết cập nhật:</p>
                  <p class="text-xs mb-1"><strong>Loại GD:</strong> ${response.trigger_info.transaction_type}</p>
                  <p class="text-xs mb-1"><strong>Số tiền:</strong> ${formatCurrency(response.trigger_info.amount)}</p>
                  <p class="text-xs mb-1"><strong>Số dư cũ:</strong> ${formatCurrency(response.trigger_info.old_balance)}</p>
                  <p class="text-xs mb-1"><strong>Số dư mới:</strong> ${formatCurrency(response.trigger_info.new_balance)}</p>
                  <p class="text-xs text-green-600 font-semibold"><strong>Thay đổi:</strong> ${response.trigger_info.balance_change > 0 ? '+' : ''}${formatCurrency(response.trigger_info.balance_change)}</p>
                </div>
              </div>
            `,
            icon: 'success',
            confirmButtonColor: '#16a34a'
          });
        } else {
          await Swal.fire({
            title: 'Thành công!',
            text: response.message || 'Duyệt giao dịch thành công',
            icon: 'success',
            confirmButtonColor: '#16a34a'
          });
        }

        loadTransactions();
      } catch (err) {
        Swal.fire({
          title: 'Lỗi!',
          text: err.message || 'Không thể duyệt giao dịch',
          icon: 'error',
          confirmButtonColor: '#dc2626'
        });
      }
    }
  };

  const handleReject = async (transactionId, transaction) => {
    const result = await Swal.fire({
      title: 'Xác nhận từ chối',
      html: `
        <div class="text-left">
          <p class="mb-2"><strong>Giao dịch:</strong> ${transaction.type === 'DEPOSIT' ? 'NẠP TIỀN' : 'RÚT TIỀN'}</p>
          <p class="mb-2"><strong>Số tiền:</strong> ${formatCurrency(transaction.amount)}</p>
          <p class="mb-2"><strong>Khách hàng:</strong> ${transaction.fullname}</p>
          <p class="mb-2"><strong>Tài khoản:</strong> #${transaction.account_id}</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Từ chối',
      cancelButtonText: 'Hủy'
    });

    if (result.isConfirmed) {
      try {
        await directorAPI.rejectTransaction(transactionId);
        await Swal.fire({
          title: 'Đã từ chối!',
          text: 'Giao dịch đã được từ chối',
          icon: 'success',
          confirmButtonColor: '#16a34a'
        });
        loadTransactions();
      } catch (err) {
        Swal.fire({
          title: 'Lỗi!',
          text: err.message || 'Không thể từ chối giao dịch',
          icon: 'error',
          confirmButtonColor: '#dc2626'
        });
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex flex-col overflow-hidden">
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
                <h1 className="text-xl font-semibold">Duyệt phiếu giao dịch</h1>
                <p className="text-sm text-gray-500">Quản lý các phiếu chờ phê duyệt</p>
              </div>
            </div>
            <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg font-semibold">
              {transactions.length} phiếu chờ
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-gray-500">Đang tải...</div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              Lỗi: {error}
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <MdAssignment size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Không có phiếu nào chờ duyệt</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => {
                const currentBalance = transaction.current_balance || 0;
                const afterBalance = transaction.type === 'DEPOSIT'
                  ? currentBalance + (transaction.amount || 0)
                  : currentBalance - (transaction.amount || 0);

                return (
                  <div key={transaction.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl font-bold">#{transaction.id}</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            transaction.type === 'DEPOSIT'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {transaction.type === 'DEPOSIT' ? 'NẠP TIỀN' : 'RÚT TIỀN'}
                          </span>
                        </div>
                        <p className="text-gray-600">
                          Khách hàng: <span className="font-semibold">{transaction.fullname}</span> (@{transaction.username})
                        </p>
                        <p className="text-gray-600">
                          Tài khoản: <span className="font-semibold">#{transaction.account_id}</span>
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          {transaction.req_date && new Date(transaction.req_date).toLocaleString('vi-VN')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-3xl font-bold ${
                          transaction.type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'DEPOSIT' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg mb-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Số dư hiện tại</p>
                        <p className="font-semibold">{formatCurrency(currentBalance)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Số tiền giao dịch</p>
                        <p className="font-semibold text-blue-600">{formatCurrency(transaction.amount)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Số dư sau GD</p>
                        <p className="font-semibold text-purple-600">{formatCurrency(afterBalance)}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleReject(transaction.id, transaction)}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-semibold"
                      >
                        <MdCancel size={20} />
                        Từ chối
                      </button>
                      <button
                        onClick={() => handleApprove(transaction.id, transaction)}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                      >
                        <MdCheckCircle size={20} />
                        Duyệt phiếu
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

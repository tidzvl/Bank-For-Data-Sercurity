import { useEffect } from 'react';
import { MdClose, MdCheckCircle, MdError, MdInfo, MdWarning } from 'react-icons/md';

export default function Toast({ message, type = 'info', trigger_info, onClose, duration = 5000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <MdCheckCircle className="text-green-500" size={24} />,
    error: <MdError className="text-red-500" size={24} />,
    warning: <MdWarning className="text-yellow-500" size={24} />,
    info: <MdInfo className="text-blue-500" size={24} />
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200'
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-md w-full ${bgColors[type]} border-2 rounded-lg shadow-lg p-4 animate-slide-in`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 mb-1">{message}</p>

          {trigger_info && (
            <div className="mt-3 p-3 bg-white rounded border border-gray-200 text-xs">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded font-mono font-semibold">
                  {trigger_info.name}
                </span>
                <span className="text-gray-500">{trigger_info.type}</span>
              </div>
              <p className="text-gray-700 mb-2">{trigger_info.description}</p>

              {trigger_info.error_code && (
                <div className="text-red-600 font-mono text-xs mb-1">
                  Error: {trigger_info.error_code}
                </div>
              )}

              {trigger_info.old_balance !== undefined && (
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số dư cũ:</span>
                    <span className="font-semibold">{trigger_info.old_balance.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số dư mới:</span>
                    <span className="font-semibold">{trigger_info.new_balance.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>Thay đổi:</span>
                    <span>{trigger_info.balance_change > 0 ? '+' : ''}{trigger_info.balance_change.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                </div>
              )}

              {trigger_info.message && (
                <p className="mt-2 text-gray-600 italic">{trigger_info.message}</p>
              )}
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <MdClose size={20} />
        </button>
      </div>
    </div>
  );
}

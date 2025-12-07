import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  MdDashboard,
  MdBarChart,
  MdPeople,
  MdCreditCard,
  MdSettings,
  MdLogout,
  MdDescription,
  MdPerson,
  MdAccountBalance,
  MdAssignment,
  MdSupervisorAccount,
  MdHistory
} from 'react-icons/md';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isOpen, onToggle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isCustomer, isStaff, isDirector } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Customer menu items
  const customerMenuItems = [
    { path: '/customer/dashboard', icon: MdDashboard, label: 'Trang chủ' },
    { path: '/customer/accounts', icon: MdAccountBalance, label: 'Tài khoản' },
    { path: '/customer/transactions', icon: MdHistory, label: 'Lịch sử GD' },
    { path: '/customer/profile', icon: MdPerson, label: 'Hồ sơ' }
  ];

  // Staff menu items
  const staffMenuItems = [
    { path: '/staff/dashboard', icon: MdDashboard, label: 'Trang chủ' },
    { path: '/staff/customers', icon: MdPeople, label: 'Khách hàng' },
    { path: '/staff/transactions/new', icon: MdAssignment, label: 'Tạo giao dịch' },
    { path: '/staff/accounts', icon: MdAccountBalance, label: 'Tài khoản' }
  ];

  // Director menu items
  const directorMenuItems = [
    { path: '/director/dashboard', icon: MdDashboard, label: 'Trang chủ' },
    { path: '/director/approvals', icon: MdAssignment, label: 'Duyệt phiếu' },
    { path: '/director/customers', icon: MdPeople, label: 'Khách hàng' },
    { path: '/director/employees', icon: MdSupervisorAccount, label: 'Nhân viên' },
    { path: '/director/accounts', icon: MdAccountBalance, label: 'Tài khoản' },
    { path: '/director/analytics', icon: MdBarChart, label: 'Phân tích' },
    { path: '/director/audit', icon: MdDescription, label: 'Audit Trail' }
  ];

  let menuItems = [];
  if (isCustomer) menuItems = customerMenuItems;
  else if (isStaff) menuItems = staffMenuItems;
  else if (isDirector) menuItems = directorMenuItems;

  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-dark-bg text-white transition-all duration-300 flex-shrink-0 flex flex-col fixed lg:relative h-full z-50`}
    >
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <span className="text-2xl font-bold">■</span>
        {isOpen && <span className="text-xl font-semibold">BM Bank</span>}
      </div>

      {/* User Info */}
      {isOpen && (
        <div className="px-4 pb-4 border-b border-gray-700">
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-accent text-dark-bg rounded-full flex items-center justify-center font-bold">
                {user?.username?.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user?.fullname}</p>
                <p className="text-xs text-gray-400">
                  {user?.role === 'CUSTOMER' && 'Khách hàng'}
                  {user?.role === 'STAFF' && 'Nhân viên'}
                  {user?.role === 'DIRECTOR' && 'Giám đốc'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                active
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              {isOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Menu */}
      <div className="px-4 pb-6 space-y-2 border-t border-gray-700 pt-4">
        <Link
          to="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <MdSettings size={20} />
          {isOpen && <span>Cài đặt</span>}
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors text-left"
        >
          <MdLogout size={20} />
          {isOpen && <span>Đăng xuất</span>}
        </button>
      </div>
    </aside>
  );
}

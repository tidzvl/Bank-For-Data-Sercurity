import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdBarChart,
  MdDescription,
  MdPeople,
  MdCreditCard,
  MdSettings,
  MdLogout,
  MdMenu,
  MdNotifications,
  MdShowChart,
  MdPerson,
  MdAttachMoney,
  MdInsertDriveFile,
  MdWarning,
  MdCheckCircle,
  MdGroupAdd,
  MdCloudUpload,
  MdSecurity,
  MdAccessTime,
  MdStorage,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";

export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0);

  const teamMembers = [
    { initials: "JD", name: "John Doe" },
    { initials: "JS", name: "Jane Smith" },
    { initials: "MJ", name: "Mike Johnson" },
    { initials: "SW", name: "Sarah Williams" },
    { initials: "RB", name: "Robert Brown" },
    { initials: "AL", name: "Alice Lee" },
    { initials: "DM", name: "David Miller" },
    { initials: "EC", name: "Emma Clark" },
  ];

  const membersPerPage = 3;
  const maxIndex = Math.max(0, teamMembers.length - membersPerPage);

  const handleLogout = () => {
    navigate("/");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNextMember = () => {
    setCurrentMemberIndex((prev) => Math.min(prev + membersPerPage, maxIndex));
  };

  const handlePrevMember = () => {
    setCurrentMemberIndex((prev) => Math.max(prev - membersPerPage, 0));
  };

  const notifications = [
    {
                    icon: MdAttachMoney,
                    type: "Biến động số dư",
                    change: "+15,000 VND",
                    time: "2 min ago",
                  },
                  {
                    icon: MdAttachMoney,
                    type: "Biến động số dư",
                    change: "-2,450 VND",
                    time: "15 min ago",
                  },
                  {
                    icon: MdAttachMoney,
                    type: "Biến động số dư",
                    change: "+1,000,000 VND",
                    time: "1 hour ago",
                  },
                  {
                    icon: MdWarning,
                    type: "Cảnh báo đăng nhập",
                    change: "Phát hiện nơi đăng nhập mới",
                    time: "2 hours ago",
                  },
                  {
                    icon: MdCheckCircle,
                    type: "Sổ tiết kiệm",
                    change: "Tạo mới sổ tiết kiệm thành công",
                    time: "3 hours ago",
                  },
                  {
                    icon: MdWarning,
                    type: "Cảnh báo đăng nhập",
                    change: "Phát hiện nơi đăng nhập mới",
                    time: "5 hours ago",
                  },
                  {
                    icon: MdAttachMoney,
                    type: "Biến động số dư",
                    change: "-127,043 VND",
                    time: "6 hours ago",
                  },
                  {
                    icon: MdAttachMoney,
                    type: "Biến động số dư",
                    change: "+335,445 VND",
                    time: "8 hours ago",
                  }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-dark-bg text-white transition-all duration-300 flex-shrink-0 flex flex-col fixed lg:relative h-full z-50 ${
          !sidebarOpen ? "lg:w-20" : ""
        }`}
      >
        <div className="p-6 flex items-center gap-3">
          <span className="text-2xl font-bold">■</span>
          {sidebarOpen && <span className="text-xl font-semibold">BM Bank</span>}
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <a
            href="#dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-800 text-white"
          >
            <MdDashboard size={20} />
            {sidebarOpen && <span>Trang chủ</span>}
          </a>
          <a
            href="#analytics"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <MdBarChart size={20} />
            {sidebarOpen && <span>Phân tích</span>}
          </a>
          <a
            href="#reports"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <MdDescription size={20} />
            {sidebarOpen && <span>Báo cáo</span>}
          </a>
          <a
            href="/transfer"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <MdPeople size={20} />
            {sidebarOpen && <span>Chuyển tiền</span>}
          </a>
          <a
            href="/accounts"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <MdCreditCard size={20} />
            {sidebarOpen && <span>Tài khoản</span>}
          </a>
        </nav>

        <div className="px-4 pb-6 space-y-2 border-t border-gray-700 pt-4">
          <a
            href="#settings"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <MdSettings size={20} />
            {sidebarOpen && <span>Settings</span>}
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors text-left"
          >
            <MdLogout size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSidebar}
                className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
              >
                <MdMenu size={24} />
              </button>
              <span className="font-semibold">BM Bank</span>
              <span className="text-gray-400">/</span>
              <h1 className="text-xl font-semibold">Trang chủ</h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <MdNotifications size={24} />
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                  3
                </span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-dark-bg text-white rounded-full flex items-center justify-center font-semibold">
                  AU
                </div>
                <span className="font-medium hidden sm:block">Tin dep trai</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid lg:grid-cols-10 gap-6">
            {/* Column A - 70% */}
            <div className="lg:col-span-7 space-y-6">
              {/* Stats Row */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <MdShowChart size={20} className="text-gray-600" />
                    <span className="text-sm font-medium text-gray-600">Số dư</span>
                  </div>
                  <div className="text-3xl font-bold mb-2">127,450 VND</div>
                  <div className="text-sm text-teal-accent font-medium">SINH LỜI MỖI NGÀY</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <MdPeople size={20} className="text-gray-600" />
                    <span className="text-sm font-medium text-gray-600">Giao dịch</span>
                  </div>
                  <div className="text-3xl font-bold mb-2">8,432</div>
                  <div className="text-sm text-teal-accent font-medium">+5.2%</div>
                </div>
              </div>

              {/* Chart */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Kiểm soát thu chi</h3>
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-dark-bg rounded"></span>
                      <span>Tiền vào</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-gray-300 rounded"></span>
                      <span>Tiền ra</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-end justify-between h-64 gap-1">
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
                    (month, index) => (
                      <div key={month} className="flex-1 flex flex-col items-center gap-2">
                        <div className="flex items-end gap-1 w-full h-full">
                          <div
                            className="flex-1 bg-dark-bg rounded-t"
                            style={{ height: `${60 + Math.random() * 40}%` }}
                          ></div>
                          <div
                            className="flex-1 bg-gray-300 rounded-t"
                            style={{ height: `${50 + Math.random() * 50}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">{month}</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Info Cards */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <MdAccessTime size={20} className="text-gray-600" />
                    <h3 className="font-semibold">Tháng này</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Tiền vào</span>
                      <span className="font-semibold">1,002,333 VND</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Tiền ra</span>
                      <span className="font-semibold">3,009,119 VND</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <MdStorage size={20} className="text-gray-600" />
                    <h3 className="font-semibold">Trạng thái tài khoản</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Hạn mức</span>
                      <span className="font-semibold">1,000,000,000 VND</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Đã sử dụng</span>
                      <span className="font-semibold">62.8%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Column B - 30% */}
            <div className="lg:col-span-3 space-y-6">
              {/* Notifications */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-[calc(90vh-8rem)]">
                <h3 className="font-semibold mb-4">Thông báo gần đây</h3>
                <div className="space-y-3 overflow-y-auto max-h-[calc(100%-8rem)]">
                  {notifications.map((notification, index) => {
                    const Icon = notification.icon;
                    return (
                      <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Icon size={18} className="text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <p className="text-sm font-medium">{notification.type}</p>
                              <p className="text-sm text-gray-600">{notification.change}</p>
                            </div>
                            <span className="text-xs text-gray-500 whitespace-nowrap">{notification.time}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Team Members */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Tài khoản đã lưu</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={handlePrevMember}
                      disabled={currentMemberIndex === 0}
                      className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <MdChevronLeft size={20} />
                    </button>
                    <button
                      onClick={handleNextMember}
                      disabled={currentMemberIndex >= maxIndex}
                      className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <MdChevronRight size={20} />
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  {teamMembers
                    .slice(currentMemberIndex, currentMemberIndex + membersPerPage)
                    .map((member, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-dark-bg text-white rounded-full flex items-center justify-center font-semibold text-sm">
                          {member.initials}
                        </div>
                        <span className="text-sm font-medium">{member.name}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

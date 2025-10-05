import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  MdAccountBalance,
  MdSavings,
  MdAttachMoney,
} from 'react-icons/md';

export default function Accounts() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [cardStates, setCardStates] = useState([true, true, false]);

  const handleLogout = () => {
    navigate('/');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleCard = (index) => {
    const newStates = [...cardStates];
    newStates[index] = !newStates[index];
    setCardStates(newStates);
  };

  const handleCardClick = (cardId) => {
    navigate(`/accounts/card/${cardId}`);
  };

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
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
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
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-800 text-white"
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
              <h1 className="text-xl font-semibold">Tài khoản</h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <MdNotifications size={24} />
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                  5
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

        {/* Accounts Content */}
        <div className="flex-1 overflow-auto p-6">
          <h1 className="text-3xl font-bold mb-8">Tài khoản và thẻ</h1>

          {/* My Accounts Section */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-6">Tài khoản</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Checking Account */}
              <div className="bg-dark-bg text-white p-6 rounded-lg">
                <div className="flex items-center gap-2 mb-6">
                  <MdAccountBalance size={24} />
                  <span className="font-semibold">Tài khoản thanh toán</span>
                </div>
                <div className="mb-4">
                  <div className="text-sm text-gray-400 mb-1">Số dư</div>
                  <div className="text-4xl font-bold">46,678 VND</div>
                </div>
                <div className="mb-4 py-3 px-4 bg-gray-800 rounded">
                  <span className="text-sm text-gray-400">Lãi suất: </span>
                  <span className="text-sm font-semibold text-teal-accent">+2.36%</span>
                </div>
                <div className="space-y-2 mb-6 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Số tài khoản:</span>
                    <span className="text-white">AB11 0000 0000 1111</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Chủ tài khoản:</span>
                    <span className="text-white">Nguyễn Tín</span>
                  </div>
                </div>
                <button className="w-full bg-white text-dark-bg py-3 rounded font-medium hover:bg-gray-100 transition-colors">
                  Xem chi tiết
                </button>
              </div>

              {/* Savings Account */}
              <div className="bg-dark-bg text-white p-6 rounded-lg">
                <div className="flex items-center gap-2 mb-6">
                  <MdSavings size={24} />
                  <span className="font-semibold">Tài khoản tiết kiệm</span>
                </div>
                <div className="mb-4">
                  <div className="text-sm text-gray-400 mb-1">Số dư</div>
                  <div className="text-4xl font-bold">46,678 VND</div>
                </div>
                <div className="mb-4 py-3 px-4 bg-gray-800 rounded">
                  <span className="text-sm text-gray-400">Lãi suất: </span>
                  <span className="text-sm font-semibold text-teal-accent">+2.36%</span>
                </div>
                <div className="space-y-2 mb-6 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Số tài khoản:</span>
                    <span className="text-white">AB11 0000 0000 1111</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Chủ tài khoản:</span>
                    <span className="text-white">Nguyễn Tín</span>
                  </div>
                </div>
                <button className="w-full bg-white text-dark-bg py-3 rounded font-medium hover:bg-gray-100 transition-colors">
                  Xem chi tiết
                </button>
              </div>

              {/* Budget Account */}
              <div className="bg-dark-bg text-white p-6 rounded-lg">
                <div className="flex items-center gap-2 mb-6">
                  <MdAttachMoney size={24} />
                  <span className="font-semibold">Tài khoản tín dụng</span>
                </div>
                <div className="mb-4">
                  <div className="text-sm text-gray-400 mb-1">Số dư</div>
                  <div className="text-4xl font-bold">46,678 VND</div>
                </div>
                <div className="mb-4 py-3 px-4 bg-gray-800 rounded">
                  <span className="text-sm text-gray-400">Lãi suất: </span>
                  <span className="text-sm font-semibold text-teal-accent">+2.36%</span>
                </div>
                <div className="space-y-2 mb-6 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Số tài khoản:</span>
                    <span className="text-white">AB11 0000 0000 1111</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Chủ tài khoản:</span>
                    <span className="text-white">Nguyễn Tín</span>
                  </div>
                </div>
                <button className="w-full bg-white text-dark-bg py-3 rounded font-medium hover:bg-gray-100 transition-colors">
                  Xem chi tiết
                </button>
              </div>
            </div>
          </section>

          {/* My Cards Section */}
          <section>
            <h2 className="text-xl font-semibold mb-6">Thẻ</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Peach Card */}
              <div
                onClick={() => handleCardClick('1')}
                className="bg-gradient-to-br from-orange-200 to-yellow-100 p-6 rounded-xl cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-12">
                  <MdCreditCard size={32} className="text-gray-700" />
                  <div onClick={(e) => e.stopPropagation()}>
                    <label className="relative inline-block w-12 h-6">
                      <input
                        type="checkbox"
                        checked={cardStates[0]}
                        onChange={() => toggleCard(0)}
                        className="sr-only peer"
                      />
                      <span className="absolute cursor-pointer inset-0 bg-gray-300 rounded-full transition-colors peer-checked:bg-teal-accent"></span>
                      <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></span>
                    </label>
                  </div>
                </div>
                <div className="text-2xl font-semibold mb-6 tracking-wider">**** **** **** 1234</div>
                <div className="flex justify-between items-end">
                  <div className="text-sm font-medium text-gray-700">Physical & Active</div>
                  <div className="text-xl font-bold">45,678 VND</div>
                </div>
              </div>

              {/* Blue Card */}
              <div
                onClick={() => handleCardClick('2')}
                className="bg-gradient-to-br from-blue-300 to-purple-300 p-6 rounded-xl cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-12">
                  <MdCreditCard size={32} className="text-gray-700" />
                  <div onClick={(e) => e.stopPropagation()}>
                    <label className="relative inline-block w-12 h-6">
                      <input
                        type="checkbox"
                        checked={cardStates[1]}
                        onChange={() => toggleCard(1)}
                        className="sr-only peer"
                      />
                      <span className="absolute cursor-pointer inset-0 bg-gray-300 rounded-full transition-colors peer-checked:bg-teal-accent"></span>
                      <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></span>
                    </label>
                  </div>
                </div>
                <div className="text-2xl font-semibold mb-6 tracking-wider">**** **** **** 5678</div>
                <div className="flex justify-between items-end">
                  <div className="text-sm font-medium text-gray-700">Physical & Active</div>
                  <div className="text-xl font-bold">32,450 VND</div>
                </div>
              </div>

              {/* White Card */}
              <div
                onClick={() => handleCardClick('3')}
                className="bg-white border-2 border-gray-300 p-6 rounded-xl cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-12">
                  <MdCreditCard size={32} className="text-gray-700" />
                  <div onClick={(e) => e.stopPropagation()}>
                    <label className="relative inline-block w-12 h-6">
                      <input
                        type="checkbox"
                        checked={cardStates[2]}
                        onChange={() => toggleCard(2)}
                        className="sr-only peer"
                      />
                      <span className="absolute cursor-pointer inset-0 bg-gray-300 rounded-full transition-colors peer-checked:bg-teal-accent"></span>
                      <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></span>
                    </label>
                  </div>
                </div>
                <div className="text-2xl font-semibold mb-6 tracking-wider text-gray-800">**** **** **** 9012</div>
                <div className="flex justify-between items-end">
                  <div className="text-sm font-medium text-gray-700">Physical & Inactive</div>
                  <div className="text-xl font-bold text-gray-800">15,230 VND</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

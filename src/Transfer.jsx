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
  MdFileUpload,
  MdFileDownload,
  MdAdd,
} from 'react-icons/md';

function Transfer() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('own');
  const [dataUnit, setDataUnit] = useState('D');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    id: '',
    data: ''
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Transfer data:', { ...formData, dataUnit });
  };

  const savedUsers = [
    { initials: 'MJ', name: 'Maria Jones' },
    { initials: 'DS', name: 'David Smith' },
    { initials: 'EW', name: 'Emma Wilson' },
    { initials: 'JB', name: 'James Brown' }
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
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-800 text-white"
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
              <h1 className="text-xl font-semibold">Chuyển tiền</h1>
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

        {/* Transfer Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Left Column - Select User (45%) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-6">Người nhận</h3>
                
                {/* Account Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <MdCreditCard size={20} />
                    <span className="font-medium">Tài khoản đã chọn</span>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngân hàng:</span>
                      <span className="font-semibold">BM Bank</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số tài khoản:</span>
                      <span className="font-mono text-xs">AB11 0000 0000 1111 1111 11</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Chủ tài khoản:</span>
                      <span className="font-semibold">Nguyễn Tín</span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <MdFileUpload size={20} />
                      <span className="font-medium">Share</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-dark-bg text-white rounded-lg hover:bg-gray-900 transition-colors">
                      <MdFileDownload size={20} />
                      <span className="font-medium">Lưu</span>
                    </button>
                  </div>
                </div>

                {/* Saved Users */}
                <div className="mt-8">
                  <h4 className="font-semibold mb-4">Tài khoản đã lưu</h4>
                  <div className="space-y-3">
                    {savedUsers.map((user, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="w-10 h-10 bg-dark-bg text-white rounded-full flex items-center justify-center font-semibold text-sm">
                          {user.initials}
                        </div>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    ))}
                    <button className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-dark-bg hover:bg-gray-50 transition-colors">
                      <MdAdd size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Transfer Form (55%) */}
            <div className="lg:col-span-7">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-6">Tài khoản gửi</h3>
                
                {/* Tabs */}
                <div className="flex gap-4 mb-6 border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab('own')}
                    className={`pb-3 px-4 font-medium transition-colors ${
                      activeTab === 'own'
                        ? 'text-dark-bg border-b-2 border-dark-bg'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Tài khoản hiện tại
                  </button>
                  <button
                    onClick={() => setActiveTab('other')}
                    className={`pb-3 px-4 font-medium transition-colors ${
                      activeTab === 'other'
                        ? 'text-dark-bg border-b-2 border-dark-bg'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Tài khoản khác
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số tài khoản:</span>
                      <span className="font-mono text-xs">AB11 0000 0000 1111 1111 11</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số dư:</span>
                      <span className="font-semibold">1,330,121 VND</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số tiền *
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="number"
                        name="data"
                        placeholder="0"
                        value={formData.data}
                        onChange={handleInputChange}
                        required
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-bg focus:border-transparent"
                      />
                      <select
                        value={dataUnit}
                        onChange={(e) => setDataUnit(e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-bg focus:border-transparent"
                      >
                        <option value="D">VND</option>
                        <option value="K">USD</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-dark-bg text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                  >
                    Tiếp tục
                    <span>→</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Transfer;

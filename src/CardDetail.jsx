import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  MdArrowBack,
  MdArrowUpward,
  MdArrowDownward,
} from 'react-icons/md';

export default function CardDetail() {
  const navigate = useNavigate();
  const { cardId } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const cardData = {
    '1': {
      number: '**** **** **** 1234',
      type: 'Physical',
      active: true,
      created: '15/03/2024',
      cvc: '***',
      balance: '45,678 VND',
      color: 'peach'
    },
    '2': {
      number: '**** **** **** 5678',
      type: 'Physical',
      active: true,
      created: '10/02/2024',
      cvc: '***',
      balance: '32,450 VND',
      color: 'blue'
    },
    '3': {
      number: '**** **** **** 9012',
      type: 'Physical',
      active: false,
      created: '05/01/2024',
      cvc: '***',
      balance: '12,340 VND',
      color: 'white'
    }
  };

  const transferHistory = [
    { id: 1, date: '04/10/2024', recipient: 'John Doe', amount: '+2,500 VND', type: 'received' },
    { id: 2, date: '03/10/2024', recipient: 'Jane Smith', amount: '-1,200 VND', type: 'sent' },
    { id: 3, date: '02/10/2024', recipient: 'Mike Johnson', amount: '-500 VND', type: 'sent' },
    { id: 4, date: '01/10/2024', recipient: 'Sarah Williams', amount: '+3,800 VND', type: 'received' },
    { id: 5, date: '30/09/2024', recipient: 'Robert Brown', amount: '-2,100 VND', type: 'sent' },
    { id: 6, date: '29/09/2024', recipient: 'Alice Lee', amount: '+1,500 VND', type: 'received' },
  ];

  const card = cardData[cardId] || cardData['1'];

  const handleLogout = () => {
    navigate('/');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleBack = () => {
    navigate('/accounts');
  };

  const getCardGradient = (color) => {
    if (color === 'peach') return 'bg-gradient-to-br from-orange-200 to-yellow-100';
    if (color === 'blue') return 'bg-gradient-to-br from-blue-300 to-purple-300';
    return 'bg-white border-2 border-gray-300';
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
              <button
                onClick={handleBack}
                className="hover:text-dark-bg font-medium transition-colors"
              >
                Tài khoản
              </button>
              <span className="text-gray-400">/</span>
              <h1 className="text-xl font-semibold">Chi tiết thẻ</h1>
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
                <span className="font-medium hidden sm:block">Admin User</span>
              </div>
            </div>
          </div>
        </header>

        {/* Card Detail Content */}
        <div className="flex-1 overflow-auto p-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 mb-6 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <MdArrowBack size={20} />
            <span className="font-medium">Quay lại</span>
          </button>

          <div className="grid lg:grid-cols-5 gap-6">
            {/* Left Column - Card Info (40%) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-6">Thông tin thẻ</h3>
                
                {/* Card Display */}
                <div className={`${getCardGradient(card.color)} p-6 rounded-xl mb-6`}>
                  <div className="mb-12">
                    <MdCreditCard size={32} className="text-gray-700" />
                  </div>
                  <div className={`text-2xl font-semibold mb-6 tracking-wider ${card.color === 'white' ? 'text-gray-800' : ''}`}>
                    {card.number}
                  </div>
                  <div className="flex justify-between items-end">
                    <div className={`text-sm font-medium ${card.color === 'white' ? 'text-gray-700' : 'text-gray-700'}`}>
                      {card.type}
                    </div>
                    <div className={`text-xl font-bold ${card.color === 'white' ? 'text-gray-800' : ''}`}>
                      {card.balance}
                    </div>
                  </div>
                </div>

                {/* Card Details Grid */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Loại thẻ:</span>
                    <span className="font-semibold">{card.type}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Trạng thái:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      card.active 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {card.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Ngày tạo:</span>
                    <span className="font-semibold">{card.created}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Data CVC:</span>
                    <span className="font-mono font-semibold">{card.cvc}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-gray-600 text-sm">Số dư:</span>
                    <span className="font-bold text-lg">{card.balance}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Transfer History (60%) */}
            <div className="lg:col-span-3">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-6">Lịch sử giao dịch</h3>
                
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {transferHistory.map((transfer) => (
                    <div
                      key={transfer.id}
                      className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        transfer.type === 'received' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {transfer.type === 'received' ? (
                          <MdArrowUpward size={20} />
                        ) : (
                          <MdArrowDownward size={20} />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{transfer.recipient}</div>
                        <div className="text-sm text-gray-500">{transfer.date}</div>
                      </div>
                      <div className={`font-bold text-lg ${
                        transfer.type === 'received' 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {transfer.amount}
                      </div>
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

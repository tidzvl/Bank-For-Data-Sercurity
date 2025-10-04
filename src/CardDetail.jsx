import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './CardDetail.css';

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
      balance: '45,678 D',
      color: 'peach'
    },
    '2': {
      number: '**** **** **** 5678',
      type: 'Physical',
      active: true,
      created: '10/02/2024',
      cvc: '***',
      balance: '32,450 D',
      color: 'blue'
    },
    '3': {
      number: '**** **** **** 9012',
      type: 'Physical',
      active: false,
      created: '05/01/2024',
      cvc: '***',
      balance: '12,340 D',
      color: 'white'
    }
  };

  const transferHistory = [
    { id: 1, date: '04/10/2024', recipient: 'John Doe', amount: '+2,500 D', type: 'received' },
    { id: 2, date: '03/10/2024', recipient: 'Jane Smith', amount: '-1,200 D', type: 'sent' },
    { id: 3, date: '02/10/2024', recipient: 'Mike Johnson', amount: '-500 D', type: 'sent' },
    { id: 4, date: '01/10/2024', recipient: 'Sarah Williams', amount: '+3,800 D', type: 'received' },
    { id: 5, date: '30/09/2024', recipient: 'Robert Brown', amount: '-2,100 D', type: 'sent' },
    { id: 6, date: '29/09/2024', recipient: 'Alice Lee', amount: '+1,500 D', type: 'received' },
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

  return (
    <div className="dashboard-container">
      {/* Sidebar Menu */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <span className="sidebar-logo">■</span>
          <span className="sidebar-title">SecureApp</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-main">
            <a href="/dashboard" className="nav-item">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              <span>Dashboard</span>
            </a>
            <a href="#analytics" className="nav-item">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="12" y1="20" x2="12" y2="10"></line>
                <line x1="18" y1="20" x2="18" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="16"></line>
              </svg>
              <span>Analytics</span>
            </a>
            <a href="#reports" className="nav-item">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <span>Reports</span>
            </a>
            <a href="/transfer" className="nav-item">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span>Chuyển dữ liệu</span>
            </a>
            <a href="/accounts" className="nav-item active">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
              <span>Tài khoản</span>
            </a>
          </div>

          <div className="nav-bottom">
            <a href="#settings" className="nav-item">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6m0 6v6m5.2-13.9l-3.5 3.5m-3.5 3.5l-3.5 3.5M23 12h-6m-6 0H5m13.9-5.2l-3.5 3.5m-3.5 3.5l-3.5 3.5"></path>
              </svg>
              <span>Settings</span>
            </a>
            <a href="#logout" className="nav-item" onClick={handleLogout}>
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>Logout</span>
            </a>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Navbar */}
        <header className="navbar">
          <div className="navbar-left">
            <button className="menu-toggle" onClick={toggleSidebar}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <span className="app-name">SecureApp</span>
            <span className="navbar-separator">/</span>
            <button className="breadcrumb-btn" onClick={handleBack}>Tài khoản</button>
            <span className="navbar-separator">/</span>
            <h2 className="page-title">Chi tiết thẻ</h2>
          </div>

          <div className="navbar-right">
            <button className="notification-btn">
              <svg className="notification-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span className="notification-badge">5</span>
            </button>
            <div className="user-info">
              <div className="user-avatar">AU</div>
              <span className="username">Admin User</span>
            </div>
          </div>
        </header>

        {/* Card Detail Content */}
        <div className="card-detail-content">
          <div className="card-detail-header">
            <button className="back-btn" onClick={handleBack}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              Quay lại
            </button>
          </div>

          <div className="card-detail-grid">
            {/* Left Column - Card Info */}
            <div className="card-info-section">
              <h3 className="section-title">Thông tin thẻ</h3>
              
              <div className={`card-display card-${card.color}`}>
                <div className="card-chip">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                    <line x1="2" y1="10" x2="22" y2="10"></line>
                  </svg>
                </div>
                <div className="card-number">{card.number}</div>
                <div className="card-footer-info">
                  <div className="card-type-label">{card.type}</div>
                  <div className="card-balance">{card.balance}</div>
                </div>
              </div>

              <div className="card-details-grid">
                <div className="detail-row">
                  <span className="detail-label">Loại thẻ:</span>
                  <span className="detail-value">{card.type}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Trạng thái:</span>
                  <span className={`detail-value status ${card.active ? 'active' : 'inactive'}`}>
                    {card.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Ngày tạo:</span>
                  <span className="detail-value">{card.created}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Data CVC:</span>
                  <span className="detail-value cvc">{card.cvc}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Số dư:</span>
                  <span className="detail-value balance">{card.balance}</span>
                </div>
              </div>
            </div>

            {/* Right Column - Transfer History */}
            <div className="history-section">
              <h3 className="section-title">Lịch sử giao dịch</h3>
              
              <div className="history-list">
                {transferHistory.map((transfer) => (
                  <div key={transfer.id} className="history-item">
                    <div className="history-icon">
                      {transfer.type === 'received' ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <polyline points="17 11 12 6 7 11"></polyline>
                          <polyline points="17 18 12 13 7 18"></polyline>
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <polyline points="7 13 12 18 17 13"></polyline>
                          <polyline points="7 6 12 11 17 6"></polyline>
                        </svg>
                      )}
                    </div>
                    <div className="history-details">
                      <div className="history-recipient">{transfer.recipient}</div>
                      <div className="history-date">{transfer.date}</div>
                    </div>
                    <div className={`history-amount ${transfer.type}`}>
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
  );
}

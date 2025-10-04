import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Accounts.css';

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
            <h2 className="page-title">Tài khoản</h2>
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

        {/* Accounts Content */}
        <div className="accounts-content">
          <h1 className="accounts-main-title">Accounts and collect</h1>

          {/* My Accounts Section */}
          <section className="accounts-section">
            <h2 className="section-title">My accounts</h2>
            <div className="accounts-grid">
              {/* Checking Account */}
              <div className="account-card">
                <div className="account-header">
                  <div className="account-type">
                    <svg className="account-type-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                      <line x1="2" y1="10" x2="22" y2="10"></line>
                    </svg>
                    <span>Checking Account</span>
                  </div>
                </div>
                <div className="account-balance">
                  <div className="balance-label">Data còn lại</div>
                  <div className="balance-amount">46,678</div>
                </div>
                <div className="account-yield">
                  <span className="yield-label">Năng suất:</span>
                  <span className="yield-value">+2.36%</span>
                </div>
                <div className="account-details">
                  <div className="detail-item">
                    <span className="detail-label">ID:</span>
                    <span className="detail-value">AB11 0000 0000 1111</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Chủ tài khoản:</span>
                    <span className="detail-value">Nicola Rich</span>
                  </div>
                </div>
                <button className="btn-see-details">See details</button>
              </div>

              {/* Savings Account */}
              <div className="account-card">
                <div className="account-header">
                  <div className="account-type">
                    <svg className="account-type-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
                    </svg>
                    <span>Savings Account</span>
                  </div>
                </div>
                <div className="account-balance">
                  <div className="balance-label">Data còn lại</div>
                  <div className="balance-amount">46,678</div>
                </div>
                <div className="account-yield">
                  <span className="yield-label">Năng suất:</span>
                  <span className="yield-value">+2.36%</span>
                </div>
                <div className="account-details">
                  <div className="detail-item">
                    <span className="detail-label">ID:</span>
                    <span className="detail-value">AB11 0000 0000 2222</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Chủ tài khoản:</span>
                    <span className="detail-value">Nicola Rich</span>
                  </div>
                </div>
                <button className="btn-see-details">See details</button>
              </div>

              {/* Budget Account */}
              <div className="account-card">
                <div className="account-header">
                  <div className="account-type">
                    <svg className="account-type-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <line x1="12" y1="1" x2="12" y2="23"></line>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                    <span>Budget Account</span>
                  </div>
                </div>
                <div className="account-balance">
                  <div className="balance-label">Data còn lại</div>
                  <div className="balance-amount">46,678</div>
                </div>
                <div className="account-yield">
                  <span className="yield-label">Năng suất:</span>
                  <span className="yield-value">+2.36%</span>
                </div>
                <div className="account-details">
                  <div className="detail-item">
                    <span className="detail-label">ID:</span>
                    <span className="detail-value">AB11 0000 0000 3333</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Chủ tài khoản:</span>
                    <span className="detail-value">Nicola Rich</span>
                  </div>
                </div>
                <button className="btn-see-details">See details</button>
              </div>
            </div>
          </section>

          {/* My Cards Section */}
          <section className="cards-section">
            <h2 className="section-title">My cards</h2>
            <div className="cards-grid">
              {/* Peach Card */}
              <div className="credit-card peach-card">
                <div className="card-top">
                  <div className="card-chip">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                      <line x1="2" y1="10" x2="22" y2="10"></line>
                    </svg>
                  </div>
                  <div className="card-toggle">
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={cardStates[0]} 
                        onChange={() => toggleCard(0)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
                <div className="card-number">**** **** **** 1234</div>
                <div className="card-info">
                  <div className="card-type">Physical & Active</div>
                  <div className="card-balance">45,678 D</div>
                </div>
              </div>

              {/* Blue Card */}
              <div className="credit-card blue-card">
                <div className="card-top">
                  <div className="card-chip">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                      <line x1="2" y1="10" x2="22" y2="10"></line>
                    </svg>
                  </div>
                  <div className="card-toggle">
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={cardStates[1]} 
                        onChange={() => toggleCard(1)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
                <div className="card-number">**** **** **** 5678</div>
                <div className="card-info">
                  <div className="card-type">Physical & Active</div>
                  <div className="card-balance">45,678 D</div>
                </div>
              </div>

              {/* White Card */}
              <div className="credit-card white-card">
                <div className="card-top">
                  <div className="card-chip">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                      <line x1="2" y1="10" x2="22" y2="10"></line>
                    </svg>
                  </div>
                  <div className="card-toggle">
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={cardStates[2]} 
                        onChange={() => toggleCard(2)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
                <div className="card-number">**** **** **** 9012</div>
                <div className="card-info">
                  <div className="card-type">Physical & Active</div>
                  <div className="card-balance">45,678 D</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

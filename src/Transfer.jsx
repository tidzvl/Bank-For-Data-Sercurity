import { useState } from 'react';
import './Transfer.css';

function Transfer({ sidebarOpen, toggleSidebar }) {
  const [activeTab, setActiveTab] = useState('own');
  const [dataUnit, setDataUnit] = useState('D');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    id: '',
    data: ''
  });

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

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? '' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">■</div>
          <h1 className="sidebar-title">SecureApp</h1>
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
            <a href="#" className="nav-item">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
              <span>Analytics</span>
            </a>
            <a href="#" className="nav-item">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              <span>Reports</span>
            </a>
            <a href="#" className="nav-item active">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span>Chuyển dữ liệu</span>
            </a>
            <a href="#" className="nav-item">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 2v20M2 12h20"></path>
              </svg>
              <span>Data</span>
            </a>
          </div>
          
          <div className="nav-bottom">
            <a href="#" className="nav-item">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"></path>
              </svg>
              <span>Settings</span>
            </a>
            <a href="/" className="nav-item">
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>Logout</span>
            </a>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Navbar */}
        <div className="navbar">
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
            <h2 className="page-title">Chuyển dữ liệu</h2>
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
        </div>

        {/* Transfer Content */}
        <div className="transfer-content">
          {/* Left Column - Select User */}
          <div className="transfer-left">
            <div className="select-user-card">
              <h3 className="card-title">Chọn người dùng</h3>
              
              {/* Account Info */}
              <div className="account-info">
                <div className="account-type">
                  <svg className="account-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                    <line x1="2" y1="10" x2="22" y2="10"></line>
                  </svg>
                  <span>Checking Account</span>
                </div>
                
                <div className="account-details">
                  <div className="detail-row">
                    <span className="detail-label">Data:</span>
                    <span className="detail-value">10011100</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">ID:</span>
                    <span className="detail-value">AB11 0000 0000 1111 1111 11</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Chủ tài khoản:</span>
                    <span className="detail-value-name">Nicola Rich</span>
                  </div>
                </div>

                <div className="action-buttons">
                  <button className="btn-action btn-share">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                      <polyline points="16 6 12 2 8 6"></polyline>
                      <line x1="12" y1="2" x2="12" y2="15"></line>
                    </svg>
                    Share ID
                  </button>
                  <button className="btn-action btn-request">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Request
                  </button>
                </div>
              </div>

              {/* Saved Users */}
              <div className="saved-users">
                <h4 className="saved-title">Người dùng đã lưu</h4>
                <div className="saved-list">
                  {[
                    { initials: 'MJ', name: 'Maria Jones' },
                    { initials: 'DS', name: 'David Smith' },
                    { initials: 'EW', name: 'Emma Wilson' },
                    { initials: 'JB', name: 'James Brown' }
                  ].map((user, index) => (
                    <div key={index} className="saved-user-item">
                      <div className="saved-avatar">{user.initials}</div>
                      <div className="saved-name">{user.name}</div>
                    </div>
                  ))}
                  <button className="btn-add-user">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Transfer Form */}
          <div className="transfer-right">
            <div className="transfer-form-card">
              <h3 className="card-title">Chuyển tới</h3>
              
              {/* Tabs */}
              <div className="transfer-tabs">
                <button 
                  className={`tab-btn ${activeTab === 'own' ? 'active' : ''}`}
                  onClick={() => setActiveTab('own')}
                >
                  Tài khoản của tôi
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'other' ? 'active' : ''}`}
                  onClick={() => setActiveTab('other')}
                >
                  Tài khoản khác
                </button>
              </div>

              {/* Form */}
              <form className="transfer-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Tên</label>
                    <input
                      type="text"
                      name="firstName"
                      className="form-input"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Nhập tên"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Họ</label>
                    <input
                      type="text"
                      name="lastName"
                      className="form-input"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Nhập họ"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    ID <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="id"
                    className="form-input"
                    value={formData.id}
                    onChange={handleInputChange}
                    placeholder="AB11 0000 0000 0000 0000 00"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Data <span className="required">*</span>
                  </label>
                  <div className="input-with-select">
                    <input
                      type="number"
                      name="data"
                      className="form-input data-input"
                      value={formData.data}
                      onChange={handleInputChange}
                      placeholder="0"
                      required
                    />
                    <select 
                      className="data-unit-select"
                      value={dataUnit}
                      onChange={(e) => setDataUnit(e.target.value)}
                    >
                      <option value="D">D</option>
                      <option value="K">K</option>
                      <option value="M">M</option>
                      <option value="G">G</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="btn-continue">
                  Tiếp tục
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Transfer;

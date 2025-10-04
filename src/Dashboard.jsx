import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    navigate("/");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar Menu */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <span className="sidebar-logo">■</span>
          <span className="sidebar-title">BM Bank</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-main">
            <a href="#dashboard" className="nav-item active">
              <svg
                className="nav-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              <span>Dashboard</span>
            </a>
            <a href="#analytics" className="nav-item">
              <svg
                className="nav-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <line x1="12" y1="20" x2="12" y2="10"></line>
                <line x1="18" y1="20" x2="18" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="16"></line>
              </svg>
              <span>Phân tích</span>
            </a>
            <a href="#reports" className="nav-item">
              <svg
                className="nav-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <span>Báo cáo</span>
            </a>
            <a href="/transfer" className="nav-item">
              <svg
                className="nav-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span>Chuyển tiền</span>
            </a>
            <a href="/accounts" className="nav-item">
              <svg
                className="nav-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
              <span>Tài khoản</span>
            </a>
          </div>

          <div className="nav-bottom">
            <a href="#settings" className="nav-item">
              <svg
                className="nav-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6m0 6v6m5.2-13.9l-3.5 3.5m-3.5 3.5l-3.5 3.5M23 12h-6m-6 0H5m13.9-5.2l-3.5 3.5m-3.5 3.5l-3.5 3.5"></path>
              </svg>
              <span>Settings</span>
            </a>
            <a href="#logout" className="nav-item" onClick={handleLogout}>
              <svg
                className="nav-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
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
            <span className="app-name">BM Bank</span>
            <span className="navbar-separator">/</span>
            <h1 className="page-title">Trang chủ</h1>
          </div>
          <div className="navbar-right">
            <button className="notification-btn">
              <svg
                className="notification-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span className="notification-badge">3</span>
            </button>
            <div className="user-info">
              <div className="user-avatar">AU</div>
              <span className="username">Tin dep trai</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content - 2 Columns */}
        <div className="dashboard-content">
          {/* Column A - 60% */}
          <div className="column-a">
            {/* Row 1 - 2 blocks */}
            <div className="row row-1">
              <div className="stat-card stat-card-large">
                <div className="stat-header">
                  <svg
                    className="stat-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                  <span className="stat-label">Số dư</span>
                </div>
                <div className="stat-value">127,450 VND</div>
                <div className="stat-change positive">SINH LỜI MỖI NGÀY</div>
              </div>
              <div className="stat-card stat-card-small">
                <div className="stat-header">
                  <svg
                    className="stat-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  <span className="stat-label">Giao dịch</span>
                </div>
                <div className="stat-value">8,432</div>
                <div className="stat-change positive">+5.2%</div>
              </div>
            </div>

            {/* Row 2 - Column Chart */}
            <div className="row-2">
              <div className="chart-card">
                <div className="chart-header">
                  <h3>Kiểm soát thu chi</h3>
                  <div className="chart-legend">
                    <span className="legend-item">
                      <span className="legend-color legend-color-a"></span>
                      Tiền vào
                    </span>
                    <span className="legend-item">
                      <span className="legend-color legend-color-b"></span>
                      Tiền ra
                    </span>
                  </div>
                </div>
                <div className="chart-container">
                  <div className="chart-bars">
                    {[
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "Jun",
                      "Jul",
                      "Aug",
                      "Sep",
                      "Oct",
                      "Nov",
                      "Dec",
                    ].map((month, index) => (
                      <div key={month} className="chart-group">
                        <div className="bars">
                          <div
                            className="bar bar-a"
                            style={{ height: `${60 + Math.random() * 40}%` }}
                          ></div>
                          <div
                            className="bar bar-b"
                            style={{ height: `${50 + Math.random() * 50}%` }}
                          ></div>
                        </div>
                        <div className="chart-label">{month}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3 - 2 equal blocks */}
            <div className="row row-3">
              <div className="info-card">
                <div className="info-header">
                  <svg
                    className="info-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <h3>Tháng này</h3>
                </div>
                <div className="info-metrics">
                  <div className="metric-item">
                    <span className="metric-label">Tiền vào</span>
                    <span className="metric-value">944,457,122 VND</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Tiền ra</span>
                    <span className="metric-value">872,144,555 VND</span>
                  </div>
                </div>
              </div>
              <div className="info-card">
                <div className="info-header">
                  <svg
                    className="info-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <rect
                      x="2"
                      y="2"
                      width="20"
                      height="8"
                      rx="2"
                      ry="2"
                    ></rect>
                    <rect
                      x="2"
                      y="14"
                      width="20"
                      height="8"
                      rx="2"
                      ry="2"
                    ></rect>
                    <line x1="6" y1="6" x2="6.01" y2="6"></line>
                    <line x1="6" y1="18" x2="6.01" y2="18"></line>
                  </svg>
                  <h3>Trạng thái tài khoản</h3>
                </div>
                <div className="info-metrics">
                  <div className="metric-item">
                    <span className="metric-label">Hạn mức</span>
                    <span className="metric-value">10,000,000,000 VND</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Đã sử dụng</span>
                    <span className="metric-value">45%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column B - 40% */}
          <div className="column-b">
            {/* Notifications - 90% */}
            <div className="notifications-section">
              <h3 className="section-title">Thông báo gần đây</h3>
              <div className="notifications-list">
                {[
                  {
                    icon: "dollar",
                    type: "Biến động số dư",
                    change: "+15,000 VND",
                    time: "2 min ago",
                  },
                  {
                    icon: "dollar",
                    type: "Biến động số dư",
                    change: "-2,450 VND",
                    time: "15 min ago",
                  },
                  {
                    icon: "dollar",
                    type: "Biến động số dư",
                    change: "+1,000,000 VND",
                    time: "1 hour ago",
                  },
                  {
                    icon: "alert",
                    type: "Cảnh báo đăng nhập",
                    change: "Phát hiện nơi đăng nhập mới",
                    time: "2 hours ago",
                  },
                  {
                    icon: "check",
                    type: "Sổ tiết kiệm",
                    change: "Tạo mới sổ tiết kiệm thành công",
                    time: "3 hours ago",
                  },
                  {
                    icon: "alert",
                    type: "Cảnh báo đăng nhập",
                    change: "Phát hiện nơi đăng nhập mới",
                    time: "5 hours ago",
                  },
                  {
                    icon: "dollar",
                    type: "Biến động số dư",
                    change: "-127,043 VND",
                    time: "6 hours ago",
                  },
                  {
                    icon: "dollar",
                    type: "Biến động số dư",
                    change: "+335,445 VND",
                    time: "8 hours ago",
                  },
                ].map((notification, index) => (
                  <div key={index} className="notification-item">
                    <div className="notification-avatar">
                      {notification.icon === "user" && (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      )}
                      {notification.icon === "dollar" && (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <line x1="12" y1="1" x2="12" y2="23"></line>
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                      )}
                      {notification.icon === "file" && (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                      )}
                      {notification.icon === "alert" && (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                          <line x1="12" y1="9" x2="12" y2="13"></line>
                          <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                      )}
                      {notification.icon === "check" && (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                      {notification.icon === "users" && (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                      )}
                      {notification.icon === "upload" && (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="17 8 12 3 7 8"></polyline>
                          <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                      )}
                      {notification.icon === "shield" && (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        </svg>
                      )}
                    </div>
                    <div className="notification-content">
                      <div className="notification-type">
                        {notification.type}
                      </div>
                      <div className="notification-change">
                        {notification.change}
                      </div>
                    </div>
                    <div className="notification-time">{notification.time}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Users List - 10% */}
            <div className="users-section">
              <h3 className="section-title">Tài khoản đã lưu</h3>
              <div className="users-list">
                {[
                  { initials: "NT", name: "Nguyễn Tín" },
                  { initials: "JS", name: "Jane Smith" },
                  { initials: "MJ", name: "Mike Johnson" },
                  // { initials: "SW", name: "Sarah Williams" },
                  // { initials: "RB", name: "Robert Brown" },
                ].map((user, index) => (
                  <div key={index} className="user-item">
                    <div className="user-avatar-small">{user.initials}</div>
                    <div className="user-name">{user.name}</div>
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

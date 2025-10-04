import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      {/* Left Side - Illustration */}
      <div className="login-left">
        <div className="illustration">
          <div className="illustration-content">
            <div className="brand-text">
              <h1>SecureApp</h1>
              <p>Professional Dashboard System</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="login-right">
        <div className="login-form-container">
          <div className="header">
            <div className="logo">
              <span className="logo-icon">■</span>
              <span className="logo-text">SecureApp</span>
            </div>
            <div className="language-selector">VN</div>
          </div>

          <div className="welcome-text">
            <h2>Chào mừng bạn đến với</h2>
            <h3>SecureApp</h3>
            <p className="login-label">Tên đăng nhập</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Nhập tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="input-label">Nhập mật khẩu</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    {showPassword ? (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </>
                    ) : (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <button type="submit" className="login-button">
              Đăng nhập
            </button>
          </form>

          <div className="footer-links">
            <a href="#forgot">Kết nối với chúng tôi</a>
            <span>|</span>
            <a href="#register">Điều khoản và điều kiện</a>
            <span>|</span>
            <a href="#help">An toàn bảo mật</a>
          </div>

          <div className="demo-notice">
            <p>⚠️ Đây là trang demo - Template Login Page</p>
          </div>
        </div>
      </div>
    </div>
  );
}

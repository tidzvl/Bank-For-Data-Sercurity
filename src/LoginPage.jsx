import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';

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
    <div className="flex h-screen">
      {/* Left Side - Illustration */}
      <div 
  className="relative hidden lg:flex lg:w-1/2 items-center justify-center after:absolute after:inset-0 after:bg-[url('img/background.png')] after:bg-cover after:bg-center after:brightness-50 after:z-0">
  <div className="text-center text-white px-12 z-10">
    <h1 className="text-5xl font-bold mb-4">BM Bank</h1>
    <p className="text-xl text-gray-300">Professional Black Market Bank System</p>
  </div>
</div>


      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-white px-6">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">■</span>
              <span className="text-xl font-semibold">BM BANK</span>
            </div>
            <div className="px-3 py-1 bg-gray-100 rounded text-sm font-medium">VN</div>
          </div>

          {/* Welcome Text */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">Chào mừng bạn đến với</h2>
            <h3 className="text-3xl font-bold mb-4">BM Bank</h3>
            <p className="text-sm font-medium text-gray-700">Tên đăng nhập</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <input
                type="text"
                placeholder="Nhập tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-bg focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhập mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-bg focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-dark-bg text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors"
            >
              Đăng nhập
            </button>
          </form>

          {/* Footer Links */}
          <div className="flex items-center justify-center gap-3 mt-8 text-sm text-gray-600">
            <a href="#forgot" className="hover:text-dark-bg">Kết nối với chúng tôi</a>
            <span>|</span>
            <a href="#register" className="hover:text-dark-bg">Điều khoản và điều kiện</a>
            <span>|</span>
            <a href="#help" className="hover:text-dark-bg">An toàn bảo mật</a>
          </div>

          {/* Demo Notice */}
          <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
            <p className="text-sm text-yellow-800">Copyright © 2025 BM Bank. All rights reserved</p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './LoginPage';

// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashboard';

// Staff Pages
import StaffDashboard from './pages/staff/StaffDashboard';

// Director Pages
import DirectorDashboard from './pages/director/DirectorDashboard';

// Old pages (keep for reference or delete later)
import Dashboard from './Dashboard';
import Transfer from './Transfer';
import Accounts from './Accounts';
import CardDetail from './CardDetail';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LoginPage />} />

          {/* Customer Routes */}
          <Route
            path="/customer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Staff Routes */}
          <Route
            path="/staff/dashboard"
            element={
              <ProtectedRoute allowedRoles={['STAFF']}>
                <StaffDashboard />
              </ProtectedRoute>
            }
          />

          {/* Director Routes */}
          <Route
            path="/director/dashboard"
            element={
              <ProtectedRoute allowedRoles={['DIRECTOR']}>
                <DirectorDashboard />
              </ProtectedRoute>
            }
          />

          {/* Old Routes (Legacy - for backward compatibility) */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transfer" element={<Transfer />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/accounts/card/:cardId" element={<CardDetail />} />

          {/* Unauthorized Page */}
          <Route
            path="/unauthorized"
            element={
              <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-red-600 mb-4">403</h1>
                  <p className="text-xl text-gray-700 mb-4">Bạn không có quyền truy cập trang này</p>
                  <a href="/" className="text-blue-600 hover:underline">
                    Quay về trang đăng nhập
                  </a>
                </div>
              </div>
            }
          />

          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

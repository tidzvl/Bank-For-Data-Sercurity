import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './LoginPage';

// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import CustomerAccounts from './pages/customer/CustomerAccounts';
import CustomerTransactions from './pages/customer/CustomerTransactions';
import CustomerProfile from './pages/customer/CustomerProfile';

// Staff Pages
import StaffDashboard from './pages/staff/StaffDashboard';
import StaffCustomers from './pages/staff/StaffCustomers';
import StaffCustomerNew from './pages/staff/StaffCustomerNew';
import StaffAccounts from './pages/staff/StaffAccounts';
import StaffAccountNew from './pages/staff/StaffAccountNew';
import StaffTransactions from './pages/staff/StaffTransactions';

// Director Pages
import DirectorDashboard from './pages/director/DirectorDashboard';
import DirectorApprovals from './pages/director/DirectorApprovals';
import DirectorCustomers from './pages/director/DirectorCustomers';
import DirectorEmployees from './pages/director/DirectorEmployees';
import DirectorAccounts from './pages/director/DirectorAccounts';
import DirectorAnalytics from './pages/director/DirectorAnalytics';
import DirectorAudit from './pages/director/DirectorAudit';

// Settings
import Settings from './pages/Settings';

// Old pages (keep for reference or delete later)
import Dashboard from './Dashboard';
import Transfer from './Transfer';
import Accounts from './Accounts';
import CardDetail from './CardDetail';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
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
          <Route
            path="/customer/accounts"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <CustomerAccounts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/transactions"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <CustomerTransactions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/profile"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <CustomerProfile />
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
          <Route
            path="/staff/customers"
            element={
              <ProtectedRoute allowedRoles={['STAFF']}>
                <StaffCustomers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/customers/new"
            element={
              <ProtectedRoute allowedRoles={['STAFF']}>
                <StaffCustomerNew />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/accounts"
            element={
              <ProtectedRoute allowedRoles={['STAFF']}>
                <StaffAccounts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/accounts/new"
            element={
              <ProtectedRoute allowedRoles={['STAFF']}>
                <StaffAccountNew />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/transactions"
            element={
              <ProtectedRoute allowedRoles={['STAFF']}>
                <StaffTransactions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/transactions/new"
            element={
              <ProtectedRoute allowedRoles={['STAFF']}>
                <StaffTransactions />
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
          <Route
            path="/director/approvals"
            element={
              <ProtectedRoute allowedRoles={['DIRECTOR']}>
                <DirectorApprovals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/director/customers"
            element={
              <ProtectedRoute allowedRoles={['DIRECTOR']}>
                <DirectorCustomers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/director/employees"
            element={
              <ProtectedRoute allowedRoles={['DIRECTOR']}>
                <DirectorEmployees />
              </ProtectedRoute>
            }
          />
          <Route
            path="/director/accounts"
            element={
              <ProtectedRoute allowedRoles={['DIRECTOR']}>
                <DirectorAccounts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/director/analytics"
            element={
              <ProtectedRoute allowedRoles={['DIRECTOR']}>
                <DirectorAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/director/audit"
            element={
              <ProtectedRoute allowedRoles={['DIRECTOR']}>
                <DirectorAudit />
              </ProtectedRoute>
            }
          />

          {/* Settings Route */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER', 'STAFF', 'DIRECTOR']}>
                <Settings />
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
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
